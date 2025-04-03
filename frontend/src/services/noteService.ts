import { Note } from "../types/types";

export const getNotesFromDb = async (
  userId: string
): Promise<Note[] | null> => {
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

  const result = await response.json();
  return { ...result, userId: result.user_id, coUsers: result.co_users };
};

export const addNoteInDb = async (noteToAdd: Note): Promise<Note | null> => {
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
      user_id: noteToAdd.userId,
      co_users: noteToAdd.coUsers,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return { ...result, userId: result.user_id, coUsers: result.co_users };
};

export const updateNoteInDb = async (
  noteToUpdate: Note
): Promise<Note | null> => {
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
      user_id: noteToUpdate.userId,
      co_users: noteToUpdate.coUsers,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return { ...result, userId: result.user_id, coUsers: result.co_users };
};

export const deleteNoteInDb = async (noteId: string): Promise<boolean> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return await response.json();
};
