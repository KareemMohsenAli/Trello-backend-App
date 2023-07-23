import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt from "bcryptjs";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  return res.json({ message: "Done", users });
});
export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
  if (req.user.isOnline === true) {
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!isPasswordValid) {
      return next(new Error("password is not valid"));
    }
    if (newPassword !== cPassword) {
      return next(new Error("doesnt Match"));
    }
    console.log(isPasswordValid, req.user);
    const newHashedPassword = bcrypt.hashSync(newPassword, 8);
    const updatePassword = await userModel.findByIdAndUpdate(req.user._id, {
      password: newHashedPassword,
    });
    return res.json({
      message: "password is change successfully!!",
      updatePassword,
    });
  } else {
    return next(
      new Error(
        "you're not allowed to change your password yet, please try again to login "
      )
    );
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { userName, age, phone } = req.body;
  if (req.user.isOnline === true) {
    const updateUser = await userModel.updateOne(
      { _id: req.user._id },
      { userName, age, phone }
    );
    return res.json({ message: "user updated sucessfully!", updateUser });
  } else {
    return next(
      new Error("you're not allowed to update, please try again to login ")
    );
  }
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user.isOnline === true && req.user.isDeleted === false) {
    const deleteUser = await userModel.deleteOne(req.user._id);
    return res.json({ message: "user deleted sucessfully!", deleteUser });
  } else {
    return next(
      new Error("you're not allowed to delete, please try again to login ")
    );
  }
});

export const logOut = asyncHandler(async (req, res, next) => {
  if (req.user.isOnline === true) {
    const isNotLoggedIn = await userModel.updateOne(
      { _id: req.user._id },
      { isOnline: false }
    );
    return res.json({ message: "Done logging out!" });
  } else {
    return next(
      new Error("you're not allowed to logout, please try again to login ")
    );
  }
});

export const softDelete = asyncHandler(async (req, res, next) => {
  if (req.user.isOnline === true) {
    const deletedSoft = await userModel.updateOne(
      { _id: req.user._id },
      { isDeleted: true }
    );
    return res.json({ message: "Email is deleted !", deletedSoft });
  } else {
    return next(
      new Error("you're not allowed to delete, please try again to login ")
    );
  }
});
