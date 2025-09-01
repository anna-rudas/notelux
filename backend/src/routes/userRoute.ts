import express from "express";
import * as userController from "../controllers/userController";
import { checkIfAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.get("/users", checkIfAuthenticated, userController.getUser);
router.post("/users", checkIfAuthenticated, userController.createUser);
router.put("/users", checkIfAuthenticated, userController.updateUser);
router.delete("/users", checkIfAuthenticated, userController.deleteUser);
router.get(
  "/users/email-by-id/:userId",
  checkIfAuthenticated,
  userController.getUserEmailFromUserId
);
router.get(
  "/users/id-by-email/:userEmail(*)",
  checkIfAuthenticated,
  userController.getUserIdFromUserEmail
);

export default router;
