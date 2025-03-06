import express from "express";
import * as noteController from "../controllers/noteController";

const router = express.Router();

router.get("/notes", noteController.getNotes);
router.post("/notes", noteController.createNote);
router.put("/notes/:id", noteController.updateNote);

export default router;
