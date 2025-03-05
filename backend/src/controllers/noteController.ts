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
