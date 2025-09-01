import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Missing User ID" });
      return;
    }
    const user = await userService.getUser(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Missing User ID" });
      return;
    }
    const userData = req.body;
    const updatedUser = await userService.updateUser(userData, userId);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Missing User ID" });
      return;
    }
    const isUserDeleted = await userService.deleteUser(userId);
    if (!isUserDeleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(isUserDeleted);
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserEmailFromUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userEmail = await userService.getUserEmailFromUserId(userId);
    res.status(200).json(userEmail);
  } catch (error) {
    console.error("Error fetching user email: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserIdFromUserEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.userEmail;
    const userId = await userService.getUserIdFromUserEmail(userEmail);
    res.status(200).json(userId);
  } catch (error) {
    console.error("Error fetching user id: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
