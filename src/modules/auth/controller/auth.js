import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt from "jsonwebtoken";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, userName, email, cPassword, password } =
    req.body;
  console.log({ firstName, lastName, userName, email, password });

  if (cPassword !== password) {
    return next(new Error("password doesnt match !!"), { cause: 409 });
  }

  const checkUser = await userModel.findOne({ email }); // {} , null
  if (checkUser) {
    return next(new Error("email exist"), { cause: 409 });
  }
  const hashPassword = bcrypt.hashSync(password, 8);
  const user = await userModel.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  return res.status(201).json({ message: "Done", user });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-valid email"), { cause: 404 });
  }
  console.log({ FE: password, HashDBPassword: user.password });
  //123456   => $2a$08$8BqRkiybWm8JAJvSlEfLWO2Ftdp.oTFnEHG9MS/JNoaLUApILMlp2
  const match = bcrypt.compareSync(password, user.password);
  console.log({ match });
  if (!match) {
    return next(new Error("In-valid login data"), { cause: 400 });
  }

  const token = jwt.sign(
    { userId: user._id, userName: user.userName, isOnline: true },
    "kareem",
    { expiresIn: "1h" }
  );
  const isLoggedIn = await userModel.updateOne(
    { _id: user._id },
    { isOnline: true }
  );

  return res.status(200).json({ message: "Done", token });
});
