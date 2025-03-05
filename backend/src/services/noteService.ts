import { db } from "../db";
import { NoteData } from "../types/types";

export const getNotes = async () => {
  const { rows } = await db.query("SELECT * FROM notes");
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
