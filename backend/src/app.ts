import express from "express";
import { db } from "./db";

const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
