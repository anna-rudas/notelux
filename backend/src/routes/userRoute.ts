import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/users/:userId", userController.getUser);

export default router;
