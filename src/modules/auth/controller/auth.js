import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import {
  emailVerificationTamplete,
  sendEmail,
} from "../../../utils/SendEmail..js";

export const signup = asyncHandler(async (req, res, next) => {  
  const { firstName, lastName, userName, email, cPassword, password } =
    req.body;
  if (cPassword !== password) {
    return next(new Error("password doesnt match !!"), { cause: 409 });
  }

  const checkUser = await userModel.findOne({ email }); // {} , null
  if (checkUser) {
    return next(new Error("email exist"), { cause: 409 });
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAILSIGNATURE,
    { expiresIn: "5m" }
  );

  const link = `http://localhost:5000/auth/comfirmEmail/${token}/${user._id}`;
  sendEmail({ to: user.email, html: emailVerificationTamplete(link),subject:"ComfrimEmail" });
  return res.status(201).json({ message: "Done", user });
});

export const comfirmEmail = asyncHandler(async (req, res, next) => {
  let userToken;
  let userID = req.params.userId;
  try {
    userToken = req.params.token;
    const decode = jwt.verify(userToken, process.env.EMAILSIGNATURE);
    const findUser = await userModel.findById(decode.id);
    if (!findUser) {
      return res.send(
        "<h2 style='color: red; text-align: center ;margin-top:100px '>Email verification failed. User not found.</h2>"
      );
    }
    if (findUser.comfirmEmail) {
      return res.send(`<div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
    <h2 style="color: #FF0000;">Email is already verified</h2>
    <p style="color: #333;">Your email was is already successfully verified. Please try again or contact support.</p>
  </div>`);
    }
    findUser.comfirmEmail = true;
    await findUser.save();
    return res.send(`<div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
  <h2 style="color: #008000;">Email Successfully Verified</h2>
  <p style="color: #333;">Your email has been successfully verified. Thank you!</p>
</div>`);
  } catch (err) {
    const findUser=await userModel.findById(userID)
    if (err.name == "TokenExpiredError" && !findUser.comfirmEmail) {
     
      return res.send(` <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
    <h2 style="color: #FF0000;">Email Verification Link Expired</h2>
    <p style="color: #333;">Your email verification link has expired.</p>
    <p style="color: #333;">If you wish to unsubscribe and delete your account, click the following link:</p>
    <div style="text-align: center; background-color: #f2f2f2; padding: 5px;">
      <p style="color: #333;">
      Click this <a href="http://localhost:5000/auth/unsubscribe/${userID}" style="color: #008000; text-decoration: none; font-weight: bold;">link</a> to unsubscribe.
      </p>
    </div>
    <p style="color: #333;">Alternatively, you can register again with the same email address to receive a new verification link.</p>
  </div>`);
    }

    return res.send("<h2 style='color: green; text-align: center ;margin-top:100px '>Failed ,you're already verify your email!!</h2>  ");
  }
});

export const unSubscribe = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const findUser = await userModel.findById(userId);
  if (!findUser) {
    return res.send(
      "<h2 style='color: red; text-align: center ;margin-top:100px '>user now is not found,  Go signUp agian please!!</h2>"
    );
  }
  const deleteUser = await userModel.findByIdAndDelete(userId);
  if (deleteUser) {
    return res.send(`<div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
      <h2 style="color: #008000;">Email Successfully Deleted Please go and signUp again</h2>
      <p style="color: #333;">Thank you!</p>
    </div>`);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-valid email"), { cause: 404 });
  }
  // console.log({ FE: password, HashDBPassword: user.password });
  //123456   => $2a$08$8BqRkiybWm8JAJvSlEfLWO2Ftdp.oTFnEHG9MS/JNoaLUApILMlp2
  const match = bcrypt.compareSync(password, user.password);
  console.log({ match });
  if (!match) {
    return next(new Error("In-valid login data"), { cause: 400 });
  }
  if(!user.comfirmEmail){
    return next(new Error("you Should comfrim your email")); 
  }

  const token = jwt.sign(
    { userId: user._id, userName: user.userName, isOnline: true }, //payload
    process.env.TOKEN_SIGNATURE,
    { expiresIn: "1h" }
  );
  const isLoggedIn = await userModel.updateOne(
    { _id: user._id },
    { isOnline: true }
  );


  return res.status(200).json({ message: "Done", token });
});
