import { User } from "../types/types";

export const addUserInDb = async (userToAdd: User): Promise<User | null> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userToAdd.userId,
      email: userToAdd.email,
      theme: userToAdd.theme,
      layout: userToAdd.layout,
      username: userToAdd.username,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return { ...result, userId: result.user_id };
};

export const getUserFromDb = async (userId: string): Promise<User | null> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  const result = await response.json();
  return { ...result, userId: result.user_id };
};

export const updateUserInDb = async (
  userToUpdate: User | null
): Promise<User | null> => {
  if (!userToUpdate) {
    return null;
  }
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(
    `${backendUrl}/api/users/${userToUpdate.userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userToUpdate.userId,
        email: userToUpdate.email,
        theme: userToUpdate.theme,
        layout: userToUpdate.layout,
        username: userToUpdate.username,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return { ...result, userId: result.user_id };
};

export const deleteUserDataInDb = async (userId: string): Promise<boolean> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(`${backendUrl}/api/users/${userId}`, {
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

export const getUserEmailFromUserId = async (
  userId: string
): Promise<string> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(
    `${backendUrl}/api/users/email-by-id/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const { email } = (await response.json()) as { email: string };
  return email;
};

export const getUserIdFromUserEmail = async (
  userEmail: string
): Promise<string> => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }
  const response = await fetch(
    `${backendUrl}/api/users/id-by-email/${userEmail}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.user_id;
};
