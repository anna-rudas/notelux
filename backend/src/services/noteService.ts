import { db } from "../db";

export const getNotes = async () => {
  const { rows } = await db.query("SELECT * FROM notes");
  return rows;
};
