import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/users/:userId", userController.getUser);
router.post("/users", userController.createUser);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);
router.get("/users/email-by-id/:userId", userController.getUserEmailFromUserId);
router.get(
  "/users/id-by-email/:userEmail(*)",
  userController.getUserIdFromUserEmail
);

export default router;
