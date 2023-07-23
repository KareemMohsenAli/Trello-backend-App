import { validation } from '../../middleware/validation.js';
import * as authController from './controller/auth.js'
import { Router } from "express";
import { logIn, signUp } from './controller/validation.js';

const router = Router();

router.post("/signup" ,validation(signUp),authController.signup)
router.post("/login", validation(logIn),authController.login)
router.get("/comfirmEmail/:token/:userId", authController.comfirmEmail)
router.get("/unsubscribe/:userId", authController.unSubscribe)


export default router