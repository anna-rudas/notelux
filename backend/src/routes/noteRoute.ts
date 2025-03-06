import express from "express";
import * as noteController from "../controllers/noteController";

const router = express.Router();

router.get("/notes", noteController.getNotes);
router.post("/notes", noteController.createNote);
router.put("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);
router.get("/notes/search", noteController.searchNotes);

export default router;
