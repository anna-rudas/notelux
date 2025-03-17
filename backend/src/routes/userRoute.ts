import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/users/:userId", userController.getUser);
router.post("/users", userController.createUser);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);

export default router;
