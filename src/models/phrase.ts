import { db, persist } from '../db/database';

export interface Phrase {
  id: number;
  text: string;
  source: string;
  category: string;
  votes: number;
  createdAt: string;
}

export const CATEGORIES = ['Videojuegos', 'Películas', 'Memes'] as const;

function query(sql: string, params: (string | number)[] = []): Phrase[] {
  const stmt = db().prepare(sql);
  stmt.bind(params);
  const result: Phrase[] = [];
  while (stmt.step()) {
    const r = stmt.getAsObject();
    result.push({
      id: Number(r.id),
      text: String(r.text),
      source: String(r.source),
      category: String(r.category),
      votes: Number(r.votes),
      createdAt: String(r.created_at),
    });
  }
  stmt.free();
  return result;
}

export const PhraseModel = {
  /** READ: todas las frases, opcionalmente filtradas por categoría. */
  list(category?: string): Phrase[] {
    if (category) {
      return query('SELECT * FROM phrases WHERE category = ? ORDER BY id DESC', [category]);
    }
    return query('SELECT * FROM phrases ORDER BY id DESC');
  },

  /** READ: ranking top 10 por votos. */
  top10(): Phrase[] {
    return query('SELECT * FROM phrases ORDER BY votes DESC, id ASC LIMIT 10');
  },

  /** CREATE */
  create(text: string, source: string, category: string): void {
    db().run('INSERT INTO phrases (text, source, category) VALUES (?, ?, ?)', [
      text,
      source,
      category,
    ]);
    persist();
  },

  /** UPDATE: editar el contenido de una frase. */
  update(id: number, text: string, source: string, category: string): void {
    db().run('UPDATE phrases SET text = ?, source = ?, category = ? WHERE id = ?', [
      text,
      source,
      category,
      id,
    ]);
    persist();
  },

  /** UPDATE: sumar un voto. */
  vote(id: number): void {
    db().run('UPDATE phrases SET votes = votes + 1 WHERE id = ?', [id]);
    persist();
  },

  /** DELETE */
  remove(id: number): void {
    db().run('DELETE FROM phrases WHERE id = ?', [id]);
    persist();
  },

  getById(id: number): Phrase | undefined {
    return query('SELECT * FROM phrases WHERE id = ?', [id])[0];
  },
};
