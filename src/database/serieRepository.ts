import { getDatabase } from "./database";
import {
  CreateSerieInput,
  Serie,
  SerieFilter,
  UpdateSerieInput,
} from "../types/serie";

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();

  let query = `
    SELECT *
    FROM series
  `;

  const params: number[] = [];

  if (filtro === "assistindo") {
    query += ` WHERE concluida = ?`;
    params.push(0);
  }

  if (filtro === "concluidas") {
    query += ` WHERE concluida = ?`;
    params.push(1);
  }

  query += ` ORDER BY createdAt DESC`;

  return await db.getAllAsync<Serie>(query, params);
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();

  const serie = await db.getFirstAsync<Serie>(
    `SELECT * FROM series WHERE id = ?`,
    [id],
  );

  return serie ?? null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();

  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    `
      INSERT INTO series (
        titulo,
        plataforma,
        temporadas,
        nota,
        concluida,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      input.titulo,
      input.plataforma,
      input.temporadas,
      input.nota,
      0,
      createdAt,
    ],
  );

  const serie = await getSerieById(result.lastInsertRowId);

  if (!serie) {
    throw new Error("Não foi possível recuperar a série criada.");
  }

  return serie;
}

export async function updateSerie(
  id: number,
  input: UpdateSerieInput,
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE series
      SET
        titulo = ?,
        plataforma = ?,
        temporadas = ?,
        nota = ?
      WHERE id = ?
    `,
    [input.titulo, input.plataforma, input.temporadas, input.nota, id],
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE series
      SET concluida = CASE
        WHEN concluida = ? THEN ?
        ELSE ?
      END
      WHERE id = ?
    `,
    [0, 1, 0, id],
  );
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(`DELETE FROM series WHERE id = ?`, [id]);
}
