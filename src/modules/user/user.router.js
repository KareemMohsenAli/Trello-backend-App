import auth from "../../middleware/auth.js";
import * as userController from "./controller/user.js";
import { Router } from "express";

const router = Router();

router.get("/", auth, userController.getUsers);
router.patch("/changepassword", auth, userController.changePassword);
router.put("/updateuser", auth, userController.updateUser);
router.delete("/deleteuser", auth, userController.deleteUser);
router.patch("/logout", auth, userController.logOut);
router.patch("/softdelete", auth, userController.softDelete);

export default router;
