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
