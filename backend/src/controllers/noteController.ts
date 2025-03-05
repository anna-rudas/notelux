import { Request, Response } from "express";
import * as noteService from "../services/noteService";
import { NoteData } from "../types/types";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await noteService.getNotes();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const noteData: NoteData = req.body;
    const newNote = await noteService.createNote(noteData);
    res.status(200).json(newNote);
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
