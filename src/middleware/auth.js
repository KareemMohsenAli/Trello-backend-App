import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/errorHandling.js"
import userModel from "../../DB/model/User.model.js"


const auth=asyncHandler(
    async(req,res,next)=>{
        const {authorization} = req.headers
        // console.log(authorization)
        if(!authorization){
            return next(new Error(" authorization is required"),{cause:400})
        }
        const decoded =jwt.verify(authorization,"kareem")
        // console.log(decoded)
        if(!decoded?.userId){
            return next(new Error(" inValid Account"))
        }
        const user =await userModel.findById(decoded.userId)
        if(!user){
            return next(new Error(" not registered user")) 
        }
        req.user = user;
        return next()
    
    }
)
export default auth