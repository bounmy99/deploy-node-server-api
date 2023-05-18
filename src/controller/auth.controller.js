import {
  SendCreate,
  SendError400,
  SendError500,
  SendError401,
  SendSuccess,
  SendError404,
} from "../service/response.js";
import {
  ValidateRegister,
  ValidateLogin,
  ValidateUpdateUers,
  ValidateUpdateUserProfile
} from "../service/validate.js";
import { GenerateToken, ComparePassword } from "../service/service.js";
import Models from "../model/index.js";
import { Emessage, Smessage } from "../service/message.js";
import mongoose from "mongoose";
import UploadImage from "../config/cloudinary.js";
export default class AuthController {
  static async getOneUser(req, res) {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return SendError401(res, Emessage.NotFoundUserId);
      }
      // const user = await Models.User.findOne({_id:userId});
      const user = await Models.User.findOne({ _id: userId, is_Active:true});
      return SendSuccess(res, Smessage.GetSuccess, user);
    } catch (error) {
      console.log(error);
      return SendError500(res, Smessage.GetError);
    }
  }

  static async GetAllUser(req, res) {
    try {
      const user = await Models.User.find();
      return SendSuccess(res, Smessage.GetAllUser, user);
    } catch (error) {
      console.log(error);
      return SendError500(res, Emessage.GetAllError);
    }
  }

  static async register(req, res) {
    try {
      const validate = ValidateRegister(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }
      const { firstName, lastName, phoneNumber, password } = req.body;
      const checkPhoneNumber = await Models.User.findOne({
        phoneNumber: phoneNumber,
      });
      if (checkPhoneNumber) {
        return SendError400(res, Emessage.AlrealyNumber, phoneNumber);
      }

      const user = await Models.User({
        firstName,
        lastName,
        phoneNumber,
        password,
      });

      await user.save("save");
      const token = await GenerateToken(user);
      // ການຈັດກຸູ່ມກ້ອນຂໍ້ມູນ ແລະ Token ເຂົ້ານຳກັນ
      const data = Object.assign(
        JSON.parse(JSON.stringify(user)),
        JSON.parse(JSON.stringify(token))
      );

      return SendCreate(res, Smessage.Register, { data });
    } catch (error) {
      console.log(error);
      return SendError400(res, Emessage.FailRegister, error);
    }
  }

  static async login(req, res) {
    try {
      const validate = ValidateLogin(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

      const { phoneNumber, password } = req.body;
      const user = await Models.User.findOne({ phoneNumber });
      if (!user) {
        return SendError400(res, Emessage.phonNotmatch);
      }

      const isMatch = await ComparePassword(password, user.password);
      if (!isMatch) {
        return SendError400(res, Emessage.passnotmatch);
      }

      const token = await GenerateToken(user);
      const data = Object.assign(
        JSON.parse(JSON.stringify(user)),
        JSON.parse(JSON.stringify(token))
      );
      return SendCreate(res, Smessage.Logined, { data });
    } catch (error) {
      console.log(error);
      return SendError500(res, Emessage.LoginErro);
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return SendError404(res, Emessage.NotFoundUserId);
      }
      const validate = ValidateUpdateUers(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

      const { firstName, lastName } = req.body;
      const user = await Models.User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
        },
        { new: true }
      );

      return SendSuccess(res, Smessage.UpdateUser, user);
    } catch (error) {
      console.log(error);
      return SendError500(res, Emessage.UpdateFail, error);
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return SendError404(res, Emessage.NotFoundUserId);
      }
      const user = await Models.User.findByIdAndUpdate(
        userId,
        {
          is_Active: false,
        },
        { new: true }
      );
      return SendSuccess(res, Smessage.DeleteUser, user);
    } catch (error) {
      console.log(error);
      return SendError500(res, Emessage.DeleteFail, error);
    }
  }

  static async updateUserProfile(req,res){
    try {
      const userId = req.params.userId
        if(!mongoose.Types.ObjectId.isValid(userId)){
          return SendError404(res, Emessage.NotFoundUserId);
        }
      const {image,oldImage} = req.body;
      const validate = ValidateUpdateUserProfile(req.body);
        if (validate.length > 0) {
          return SendError400(res, Emessage.PleaseInput + validate.join(","));  
        }
      const imageurl = await UploadImage(image,oldImage);
        if(!imageurl){
          return SendError400(res, "Base64");
        }
      const user = await Models.User.findByIdAndUpdate(userId,{

        profile:imageurl
        
      },{new:true})

      return SendSuccess(res,"Update Profile Successfully",user)
    } catch (error) {
        console.log(error);
        return SendError500(res,"Error Update Profile",error)
    }
  }
}