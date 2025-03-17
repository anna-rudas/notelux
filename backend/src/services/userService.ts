import { db } from "../db";
import { UserData } from "../types/types";

export const getUser = async (userId: string) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE "userId" = $1`, [
    userId,
  ]);
  return rows[0];
};

export const createUser = async (userData: UserData) => {
  const { email, theme, layout, username, userId } = userData;

  const { rows } = await db.query(
    `INSERT INTO users (email, theme, layout, username, "userId") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows[0];
};

export const updateUser = async (userData: UserData, userId: string) => {
  const { email, theme, layout, username } = userData;

  const { rows } = await db.query(
    `UPDATE users SET email = $1, theme = $2, layout = $3, username = $4 WHERE "userId" = $5 RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows[0];
};

export const deleteUser = async (userId: string) => {
  const { rowCount } = await db.query(`DELETE FROM users WHERE "userId" = $1`, [
    userId,
  ]);
  return rowCount ? rowCount > 0 : false;
};
