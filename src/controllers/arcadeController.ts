import { PhraseModel } from '../models/phrase';
import { render, ViewState } from '../views/arcadeView';

export class ArcadeController {
  private state: ViewState = {
    phrases: [],
    top: [],
    filter: '',
    editing: null,
    lastVotedId: null,
  };

  constructor(private root: HTMLElement) {}

  start(): void {
    this.root.addEventListener('click', (ev) => this.onClick(ev));
    this.root.addEventListener('submit', (ev) => this.onSubmit(ev));
    this.refresh();
  }

  private refresh(): void {
    this.state.phrases = PhraseModel.list(this.state.filter || undefined);
    this.state.top = PhraseModel.top10();
    render(this.root, this.state);
  }

  private onClick(ev: Event): void {
    const target = (ev.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const id = Number(target.dataset.id);
    const action = target.dataset.action;

    switch (action) {
      case 'vote':
        PhraseModel.vote(id);
        this.state.lastVotedId = id;
        break;
      case 'edit':
        this.state.editing = PhraseModel.getById(id) ?? null;
        break;
      case 'cancel':
        this.state.editing = null;
        break;
      case 'delete':
        if (!confirm('¿Eliminar esta frase del arcade?')) return;
        PhraseModel.remove(id);
        if (this.state.editing?.id === id) this.state.editing = null;
        break;
      case 'filter':
        this.state.filter = target.dataset.cat ?? '';
        break;
      default:
        return;
    }
    this.refresh();
    if (action === 'edit') {
      this.root.querySelector('#phrase-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private onSubmit(ev: Event): void {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const data = new FormData(form);
    const text = String(data.get('text') ?? '').trim();
    const source = String(data.get('source') ?? '').trim();
    const category = String(data.get('category') ?? '');

    if (text.length < 3 || !source) {
      const err = form.querySelector('#form-error');
      if (err) err.textContent = 'Escribe la frase (mínimo 3 caracteres) y su origen.';
      return;
    }

    if (this.state.editing) {
      PhraseModel.update(this.state.editing.id, text, source, category);
      this.state.editing = null;
    } else {
      PhraseModel.create(text, source, category);
    }
    this.refresh();
  }
}
