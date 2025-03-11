import { Note } from "../types/types";

export const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: noteToAdd.title,
      body: noteToAdd.body,
      color: noteToAdd.color,
      date: noteToAdd.date,
      userId: noteToAdd.userId,
      coUsers: noteToAdd.coUsers,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const updateNoteInDb = async (noteToUpdate: Note): Promise<void> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/notes/${noteToUpdate.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: noteToUpdate.title,
      body: noteToUpdate.body,
      color: noteToUpdate.color,
      date: noteToUpdate.date,
      userId: noteToUpdate.userId,
      coUsers: noteToUpdate.coUsers,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const deleteNoteInDb = async (noteId: string): Promise<void> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  await fetch(`${backendUrl}/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getNotesFromDb = async (userId: string): Promise<Note[]> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/notes/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as Note[];
};
