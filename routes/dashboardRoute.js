import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";


const router = express.Router();

// Dashboard route (protected)
router.get("/", protect, getDashboardData);

export default router;
