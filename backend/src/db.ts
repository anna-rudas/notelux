import { Pool } from "pg";
import dotenv from "dotenv";
import { io } from "./index";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function listenForDbChanges() {
  const client = await pool.connect();
  const channels = ["notes_updates", "users_updates"];
  for (const channel of channels) {
    await client.query(`LISTEN ${channel}`);
  }

  client.on("notification", (msg) => {
    io.emit(`${msg.channel}`, msg.payload);
  });
}

listenForDbChanges().catch(console.error);

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
};
