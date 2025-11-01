import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense } from "../controllers/expenseController.js"

const router = express.Router()
router.post("/add-expense",protect,addExpense)
router.get("/get-expense",protect,getAllExpense)
router.get("/download-excel",protect,downloadExpenseExcel)
router.delete("/delete-expense/:id",protect,deleteExpense)

export default router