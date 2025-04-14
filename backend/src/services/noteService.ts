import { db } from "../db";
import { NoteData } from "../types/types";

export const getNotes = async (userId: string): Promise<NoteData[] | null> => {
  const { rows } = await db.query(
    `SELECT * FROM notes WHERE $1::text IN (SELECT jsonb_array_elements_text(co_users))`,
    [userId]
  );
  return rows.length > 0 ? rows : null;
};

export const createNote = async (
  noteData: NoteData
): Promise<NoteData | null> => {
  const { title, body, color, date, user_id, co_users } = noteData;

  const { rows } = await db.query(
    `INSERT INTO notes (title, body, color, date, user_id, co_users) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, body, color, date, user_id, co_users]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateNote = async (
  noteData: NoteData,
  noteId: string
): Promise<NoteData | null> => {
  const { title, body, color, date, co_users } = noteData;

  const { rows } = await db.query(
    `UPDATE notes SET title = $1, body = $2, color = $3, date = $4, co_users = $5 WHERE id = $6 RETURNING *`,
    [title, body, color, date, co_users, noteId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const deleteNote = async (noteId: string): Promise<boolean> => {
  const { rowCount } = await db.query(`DELETE FROM notes WHERE id = $1`, [
    noteId,
  ]);
  const isNoteDeleted = rowCount ? rowCount > 0 : false;
  return isNoteDeleted;
};
