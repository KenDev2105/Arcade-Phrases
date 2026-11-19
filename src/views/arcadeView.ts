import { CATEGORIES, Phrase } from '../models/phrase';

export interface ViewState {
  phrases: Phrase[];
  top: Phrase[];
  filter: string;
  editing: Phrase | null;
  lastVotedId: number | null;
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function categoryOptions(selected: string): string {
  return CATEGORIES.map(
    (c) => `<option value="${c}" ${c === selected ? 'selected' : ''}>${c}</option>`
  ).join('');
}

function leaderboard(top: Phrase[], lastVotedId: number | null): string {
  if (top.length === 0) {
    return '<p class="empty">Todavía no hay puntajes. Vota una frase para abrir el ranking.</p>';
  }
  return `<ol class="board">${top
    .map(
      (p, i) => `
      <li class="${i === 0 ? 'first' : ''} ${p.id === lastVotedId ? 'bump' : ''}">
        <span class="rank">${i + 1}</span>
        <span class="board-text">${esc(p.text)}</span>
        <span class="score">${p.votes}</span>
      </li>`
    )
    .join('')}</ol>`;
}

function phraseCard(p: Phrase): string {
  return `
    <article class="card" data-cat="${esc(p.category)}">
      <blockquote>${esc(p.text)}</blockquote>
      <p class="meta">${esc(p.source)} — ${esc(p.category)}</p>
      <div class="card-actions">
        <button class="vote" data-action="vote" data-id="${p.id}" aria-label="Votar esta frase">
          Votar <strong>${p.votes}</strong>
        </button>
        <button class="ghost" data-action="edit" data-id="${p.id}">Editar</button>
        <button class="ghost danger" data-action="delete" data-id="${p.id}">Eliminar</button>
      </div>
    </article>`;
}

export function render(root: HTMLElement, state: ViewState): void {
  const e = state.editing;
  const filters = ['', ...CATEGORIES]
    .map(
      (c) =>
        `<button class="chip ${state.filter === c ? 'active' : ''}" data-action="filter" data-cat="${c}">${c || 'Todas'}</button>`
    )
    .join('');

  root.innerHTML = `
    <header class="top">
      <h1>Arcade de Frases Épicas</h1>
      <p>Vota las frases que merecen entrar al salón de la fama.</p>
    </header>

    <main class="layout">
      <section class="left" aria-label="Frases">
        <form id="phrase-form" class="panel" autocomplete="off">
          <h2>${e ? 'Editar frase' : 'Agregar una frase'}</h2>
          <label>Frase
            <textarea name="text" rows="2" maxlength="160" required>${e ? esc(e.text) : ''}</textarea>
          </label>
          <div class="row">
            <label>Origen
              <input name="source" maxlength="60" required value="${e ? esc(e.source) : ''}" />
            </label>
            <label>Categoría
              <select name="category">${categoryOptions(e ? e.category : CATEGORIES[0])}</select>
            </label>
          </div>
          <div class="row buttons">
            <button type="submit" class="primary">${e ? 'Guardar cambios' : 'Agregar frase'}</button>
            ${e ? '<button type="button" class="ghost" data-action="cancel">Cancelar</button>' : ''}
          </div>
          <p id="form-error" class="error" role="alert"></p>
        </form>

        <div class="filters" role="group" aria-label="Filtrar por categoría">${filters}</div>

        <div class="cards">
          ${
            state.phrases.length
              ? state.phrases.map(phraseCard).join('')
              : '<p class="empty">No hay frases en esta categoría. Agrega la primera.</p>'
          }
        </div>
      </section>

      <aside class="right" aria-label="Ranking">
        <div class="panel scoreboard">
          <h2>Top 10</h2>
          ${leaderboard(state.top, state.lastVotedId)}
        </div>
      </aside>
    </main>

    <footer class="foot">Datos guardados en SQLite (sql.js) dentro de tu navegador.</footer>
  `;
}
