import { db } from "../db";
import { UserData } from "../types/types";

export const getUser = async (userId: string) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE "userId" = $1`, [
    userId,
  ]);
  return rows[0];
};
