import './styles/styles.css';
import { initDatabase } from './db/database';
import { ArcadeController } from './controllers/arcadeController';

async function bootstrap(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = '<p class="loading">Cargando arcade…</p>';

  try {
    await initDatabase();
    new ArcadeController(root).start();
  } catch (error) {
    console.error(error);
    root.innerHTML =
      '<p class="loading">No se pudo iniciar la base de datos. Recarga la página.</p>';
  }
}

bootstrap();
