import initSqlJs, { Database } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const STORAGE_KEY = 'arcade-frases-epicas.sqlite';

let database: Database | null = null;

const SEED: Array<[string, string, string, number]> = [
  ['It\'s dangerous to go alone! Take this.', 'The Legend of Zelda', 'Videojuegos', 14],
  ['Hasta la vista, baby.', 'Terminator 2', 'Películas', 11],
  ['El pastel es una mentira.', 'Portal', 'Videojuegos', 17],
  ['Que la fuerza te acompañe.', 'Star Wars', 'Películas', 9],
  ['Stonks', 'Meme', 'Memes', 6],
  ['Nada es verdad, todo está permitido.', 'Assassin\'s Creed', 'Videojuegos', 8],
  ['Yo soy tu padre.', 'Star Wars', 'Películas', 12],
  ['Esto es bastante bien.', 'Meme del perro en llamas', 'Memes', 7],
];

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function fromBase64(text: string): Uint8Array {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function loadSaved(): Uint8Array | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? fromBase64(saved) : null;
  } catch {
    return null;
  }
}

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const saved = loadSaved();
  database = saved ? new SQL.Database(saved) : new SQL.Database();

  database.run(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      source TEXT NOT NULL,
      category TEXT NOT NULL,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const count = database.exec('SELECT COUNT(*) FROM phrases')[0].values[0][0] as number;
  if (count === 0) {
    const stmt = database.prepare(
      'INSERT INTO phrases (text, source, category, votes) VALUES (?, ?, ?, ?)'
    );
    for (const row of SEED) stmt.run(row);
    stmt.free();
    persist();
  }
}

export function db(): Database {
  if (!database) throw new Error('La base de datos no está inicializada.');
  return database;
}

/** Guarda la base de datos completa en localStorage para que sobreviva entre sesiones. */
export function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, toBase64(db().export()));
  } catch (error) {
    console.warn('No se pudo guardar la base de datos:', error);
  }
}
