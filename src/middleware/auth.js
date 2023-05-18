import { SendError401, SendError404, SendError500 } from "../service/response.js";
import { VerifyToken } from "../service/service.js";

export const auth = async(req,res,next) =>{
    try {
        const token = req.headers['token'];
            if(!token) return SendError404(res,"Not Found Token");
        const user = await VerifyToken(token);
            if(!user) return SendError401(req,"Unauthenrization");
            next();
    } catch (error) {
        console.log(error);
        return SendError500(res,"Error Authenrization",error);
        
    }
}