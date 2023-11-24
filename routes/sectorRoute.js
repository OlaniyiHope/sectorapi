// authRoutes.js
import express from "express";
import {
  addUsertoSector,
  getAllSectors,
  getSectorById,
  getUsersInSector,
  saveSetor,
  updateSector,
} from "../controller/sectorController.js";
import authenticateUser from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

router.post("/save-sector", authenticateUser, saveSetor);
router.get("/get-sectors", authenticateUser, getAllSectors);
router.post("/add-user-sector", authenticateUser, addUsertoSector);
router.get(
  "/get-users-in-sector/:sectorId",
  authenticateUser,
  getUsersInSector
);
router.put("/update-sector/:sectorId", authenticateUser, updateSector);
router.get("/get-sector/:sectorId", authenticateUser, getSectorById);

export default router;
