import express from "express";
import * as noteController from "../controllers/noteController";
import { checkIfAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.get("/notes", checkIfAuthenticated, noteController.getNotes);
router.post("/notes", noteController.createNote);
router.put("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);

export default router;
