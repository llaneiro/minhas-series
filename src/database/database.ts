import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("minhas-series.db");
  }

  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS series (
      id INTEGER PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      temporadas INTEGER NOT NULL,
      nota REAL,
      concluida INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
