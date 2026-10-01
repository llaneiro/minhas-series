## Diário do copiloto

### Registro 1 — Etapa 3

Código sugerido

```
CREATE TABLE IF NOT EXISTS series (
      id INTEGER PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      temporadas INTEGER NOT NULL,
      nota REAL,
      concluida INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
```
