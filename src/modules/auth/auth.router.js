import * as authController from './controller/auth.js'
import { Router } from "express";
const router = Router();

router.post("/signup" ,authController.signup)
router.post("/login", authController.login)
router.get("/comfirmEmail/:token/:userId", authController.comfirmEmail)
router.get("/unsubscribe/:userId", authController.unSubscribe)


export default router