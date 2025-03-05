import express from "express";
import noteRoute from "./routes/noteRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", noteRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
