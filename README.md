# Arcade de Frases Épicas

Un "arcade" donde la gente vota frases de videojuegos, películas y memes. Cada voto actualiza al instante el **Top 10** en un marcador estilo máquina recreativa.

Vista: https://arcade-phrases.vercel.app
## Tecnologías

- **Vite + TypeScript**
- **SQLite** en el navegador con [sql.js](https://sql.js.org/) (WebAssembly)
- **Persistencia:** la base de datos se exporta a `localStorage` después de cada cambio, así los datos sobreviven entre sesiones.
- **GitHub** para el código y **Vercel** para el despliegue.

## Base de datos

Tabla `phrases`:


| Campo        | Tipo    | Descripción                    |
| ------------ | ------- | ------------------------------ |
| `id`         | INTEGER | Clave primaria autoincremental |
| `text`       | TEXT    | La frase                       |
| `source`     | TEXT    | Juego, película o meme         |
| `category`   | TEXT    | Videojuegos, Películas, Memes  |
| `votes`      | INTEGER | Cantidad de votos              |
| `created_at` | TEXT    | Fecha de creación              |




## CRUD

- **Crear:** formulario "Agregar una frase".
- **Leer:** lista con filtro por categoría y ranking Top 10.
- **Actualizar:** botón "Editar" y botón "Votar".
- **Eliminar:** botón "Eliminar".



## Estructura (MVC)

```
src/
├── main.ts                          # arranque
├── db/database.ts                   # conexión SQLite + persistencia
├── models/phrase.ts                 # lógica de datos (CRUD)
├── views/arcadeView.ts              # interfaz
├── controllers/arcadeController.ts  # coordinación
└── styles/styles.css
```



## Ejecutar en local

```bash
npm install
npm run dev
```



