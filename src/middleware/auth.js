import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../../DB/model/User.model.js";

const auth = asyncHandler(
  async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization)

  if (!authorization?.startsWith("kareem__")) {
    return next(new Error(" authorization is required or inValid Bearer key"), {
      cause: 401,
    });
  }
  const splitAuthorization = authorization.split("kareem__")[1];

  const decoded = jwt.verify(splitAuthorization, process.env.TOKEN_SIGNATURE);
  // console.log(decoded)
  if (!decoded?.userId) {
    return next(new Error(" inValid Account"));
  }
  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return next(new Error(" not registered user"));
  }
  if (!user.comfirmEmail) {
    return next(new Error(" you Should comfrim your email "));
  }
  if (user.isDeleted){
    return next(new Error("this email is deleted ,please login again."));
  }

  req.user = user;
  return next();
});
export default auth;
