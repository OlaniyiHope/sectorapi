// authRoutes.js
import express from "express";
import {
  getAllSectors,
  saveSetor,
  updateUser,
} from "../controller/sectorController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import { getUser, login, register } from "../controller/authController.js";
const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

router.post("/register", register);
router.post("/login", login);
router.get("/get-user", authenticateUser, getUser);
router.put("/update-user", authenticateUser, updateUser);

export default router;
