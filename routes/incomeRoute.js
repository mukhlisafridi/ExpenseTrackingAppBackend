import express from "express"
import { addIncome, deleteIncome, downloadInExcel, getAllIncome } from "../controllers/incomeController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/add-income",protect,addIncome)
router.delete("/delete-income/:id",protect,deleteIncome)
router.get("/get-income",protect,getAllIncome)
router.get("/download-excel",protect,downloadInExcel)

export default router