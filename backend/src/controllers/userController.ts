import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
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
    const userId = req.params.userId;
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
