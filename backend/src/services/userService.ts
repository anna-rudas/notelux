import { db } from "../db";
import { UserData, UserDataGetEmail, UserDataGetUserId } from "../types/types";

export const createUser = async (
  userData: UserData
): Promise<UserData | null> => {
  const { email, theme, layout, username, userId } = userData;

  const { rows } = await db.query(
    `INSERT INTO users (email, theme, layout, username, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const getUser = async (
  userId: string | null
): Promise<UserData | null> => {
  const { rows } = await db.query(`SELECT * FROM users WHERE userid = $1`, [
    userId,
  ]);

  return rows.length > 0 ? rows[0] : null;
};

export const updateUser = async (
  userData: UserData,
  userId: string
): Promise<UserData | null> => {
  const { email, theme, layout, username } = userData;

  const { rows } = await db.query(
    `UPDATE users SET email = $1, theme = $2, layout = $3, username = $4 WHERE userid = $5 RETURNING *`,
    [email, theme, layout, username, userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const { rowCount } = await db.query(`DELETE FROM users WHERE userid = $1`, [
    userId,
  ]);
  const isUserDeleted = rowCount ? rowCount > 0 : false;
  return isUserDeleted;
};

export const getUserEmailFromUserId = async (
  userId: string
): Promise<UserDataGetEmail | null> => {
  const { rows } = await db.query(`SELECT email FROM users WHERE userid = $1`, [
    userId,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

export const getUserIdFromUserEmail = async (
  userEmail: string
): Promise<UserDataGetUserId | null> => {
  const { rows } = await db.query(
    `SELECT userid FROM users WHERE email  = $1`,
    [userEmail]
  );
  return rows.length > 0 ? rows[0] : null;
};
