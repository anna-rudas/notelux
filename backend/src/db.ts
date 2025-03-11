import { Pool } from "pg";
import dotenv from "dotenv";
import { io } from "./index";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function listenForDbChanges() {
  const client = await pool.connect();
  await client.query("LISTEN notes_updates");

  client.on("notification", (msg) => {
    io.emit("notes_table_updated", msg.payload);
  });
}

listenForDbChanges().catch(console.error);

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
};
