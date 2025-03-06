import { Request, Response } from "express";
import * as noteService from "../services/noteService";

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
    const noteData = req.body;
    const newNote = await noteService.createNote(noteData);
    res.status(200).json(newNote);
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const noteData = req.body;
    const updatedNote = await noteService.updateNote(noteData, noteId);
    if (!updatedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await noteService.deleteNote(noteId);
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(200).send();
  } catch (error) {
    console.error("Error deleting note: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
