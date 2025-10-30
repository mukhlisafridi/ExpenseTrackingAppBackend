import express from "express"
import { getUserInfo, loginUser, registerUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/uploadMiddleware.js"
const router = express.Router()

router.post("/create", registerUser)
router.post("/login",loginUser)
router.get("/getUser",protect,getUserInfo)
router.post('/file-upload', upload.single('image'), function (req, res, next) {
    if(!req.file){
        return res.status(400).json({message:"file not uploaded"})
    }  
    const imageURL = `${req.protocol}//${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({imageURL})
})

export default router;