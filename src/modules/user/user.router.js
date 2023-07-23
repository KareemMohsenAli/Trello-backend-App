import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
import { ChangePassword, UpdateUser } from "./controller/validation.js";

const router = Router();


router.get("/:userId", userController.getUsers);
router.patch("/changepassword", validation(ChangePassword),auth, userController.changePassword);
router.put("/updateuser",validation(UpdateUser), auth, userController.updateUser);
router.delete("/deleteuser", auth, userController.deleteUser);
router.patch("/logout", auth, userController.logOut);
router.patch("/softdelete", auth, userController.softDelete);

export default router;
