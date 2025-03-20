import { db } from "../db";
import { UserData } from "../types/types";

export const getUser = async (
  userId: string | null
): Promise<UserData | null> => {
  const { rows } = await db.query(`SELECT * FROM users WHERE "userId" = $1`, [
    userId,
  ]);

  return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (userData: UserData): Promise<UserData> => {
  const { email, theme, layout, username, userId } = userData;

  const { rows } = await db.query(
    `INSERT INTO users (email, theme, layout, username, "userId") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows[0];
};

export const updateUser = async (
  userData: UserData,
  userId: string
): Promise<UserData> => {
  const { email, theme, layout, username } = userData;

  const { rows } = await db.query(
    `UPDATE users SET email = $1, theme = $2, layout = $3, username = $4 WHERE "userId" = $5 RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows[0];
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const { rowCount } = await db.query(`DELETE FROM users WHERE "userId" = $1`, [
    userId,
  ]);
  return rowCount ? rowCount > 0 : false;
};

export const getUserEmailFromUserId = async (
  userId: string
): Promise<string | null> => {
  const { rows } = await db.query(
    `SELECT email FROM users WHERE "userId" = $1`,
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const getUserIdFromUserEmail = async (
  userEmail: string
): Promise<UserData | null> => {
  const { rows } = await db.query(
    `SELECT "userId" FROM users WHERE email  = $1`,
    [userEmail]
  );
  return rows.length > 0 ? rows[0] : null;
};
