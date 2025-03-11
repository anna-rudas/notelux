import { db } from "../db";
import { NoteData } from "../types/types";

export const getNotes = async (userId: string) => {
  const { rows } = await db.query(
    `SELECT * FROM notes WHERE $1 = ANY("coUsers")`,
    [userId]
  );
  return rows;
};

export const createNote = async (noteData: NoteData) => {
  const { title, body, color, date, userId, coUsers } = noteData;

  const { rows } = await db.query(
    `INSERT INTO notes (title, body, color, date, "userId", "coUsers") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, body, color, date, userId, coUsers]
  );
  return rows[0];
};

export const updateNote = async (noteData: NoteData, noteId: string) => {
  const { title, body, color, date, coUsers } = noteData;

  const { rows } = await db.query(
    `UPDATE notes SET title = $1, body = $2, color = $3, date = $4, "coUsers" = $5 WHERE id = $6 RETURNING *`,
    [title, body, color, date, coUsers, noteId]
  );
  return rows[0];
};

export const deleteNote = async (noteId: string) => {
  const { rowCount } = await db.query(`DELETE FROM notes WHERE id = $1`, [
    noteId,
  ]);
  return rowCount ? rowCount > 0 : false;
};

export const searchNotes = async (searchTerm: string) => {
  const { rows } = await db.query(
    `SELECT * FROM notes WHERE title ILIKE $1 OR body ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};
