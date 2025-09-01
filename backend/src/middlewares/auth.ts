import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdminConfig";

export const checkIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      res.status(401).send("Missing token");
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    await admin.auth().verifyIdToken(token);

    return next();
  } catch (e) {
    res.status(401).send({ error: "Invalid token" });
    return;
  }
};
