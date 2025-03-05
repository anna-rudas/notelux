import express from "express";
import * as noteController from "../controllers/noteController";

const router = express.Router();

router.get("/notes", noteController.getNotes);

export default router;
