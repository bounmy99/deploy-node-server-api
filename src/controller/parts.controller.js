import { Emessage } from "../service/message.js";
import {
  SendError400,
  SendError401,
  SendError404,
  SendError500,
  SendSuccess,
} from "../service/response.js";
import {
  ValidateParts,
  ValidatePartsUpdate,
  ValidatePartsUpdateImage,
} from "../service/validate.js";
import Models from "../model/index.js";
import UploadImage from "../config/cloudinary.js";
import mongoose from "mongoose";
export default class PartsController {
  static async insert(req, res) {
    try {
      const validate = ValidateParts(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }
      const { vehicleId, name, detail, amount, price, image } = req.body;

      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return SendError400(res, "Error VehilceId Invaild", vehicleId);
      }
      const vehicle = await Models.Vehicle.findById(vehicleId);
      if (!vehicle) {
        SendError401(res, "Not Found VehicleId", vehicle);
      }
      const imageUrl = await UploadImage(image);
      if (!imageUrl) {
        return SendError400(res, "You Must File Base64");
      }
      const parts = await Models.Parts.create({
        vehicleId: vehicle,
        name,
        detail,
        amount,
        price,
        image: imageUrl,
      });
      return SendSuccess(res, "Insert Parts Successful", parts);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Insert Parts", error);
    }
  }
  static async getAll(req, res) {
    try {
      const parts = await Models.Parts.find({ is_Active: true }).populate({
        path: "vehicleId",
        select: "name vehicleType image createdAt updatedAt",
      });
      if (!parts) {
        return SendError401(res, "Not Found Parts");
      }
      return SendSuccess(res, "Get All Parts Successful", parts);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get All Parts");
    }
  }

  static async getOne(req, res) {
    try {
      const partId = req.params.partId;
      if (!mongoose.Types.ObjectId.isValid(partId)) {
        return SendError401(res, "Error ID Invalid");
      }
      const parts = await Models.Parts.findById(partId).populate({
        path: "vehicleId",
        select: "name vehicleType image createdAt updatedAt",
      });
      if (!parts) {
        return SendError401(res, "Not Found Parts");
      }
      return SendSuccess(res, "Get One Parts Successful", parts);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get One Parts");
    }
  }

  // static async updateParts(req, res) {
  //   try {
  //     const partId = req.params.partId;
  //     const { vehicleId, name, detail, amount, price } = req.body;
  //     if (!mongoose.Types.ObjectId.isValid(partId)) {
  //       return SendError400(res, "Error ID Invalid");
  //     }
  //     if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
  //       return SendError400(res, "Error VehicleID Invalid");
  //     }
  //     const validate = ValidatePartsUpdate(req.body);
  //     if (validate.length > 0) {
  //       return SendError400(res, Emessage.PleaseInput + validate.join(","));
  //     }
  //     const partID = await Models.Parts.findById(partId);
  //     const parts = await Models.Parts.findByIdAndUpdate(partId, {
  //       vehicleId: partID.vehicleId,
  //       name,
  //       detail,
  //       amount,
  //       price
  //     });
  //     return SendSuccess(res, "Update Parts Successful", parts);
  //   } catch (error) {
  //     console.log(error);
  //     return SendError500(res, "Error Update Parts");
  //   }
  // }

  static async updateParts(req, res) {
    try {
      const partId = req.params.partId;
      if (!mongoose.Types.ObjectId.isValid(partId)) {
        return SendError404(res, "Not Found Id");
      }

      const validate = ValidatePartsUpdate(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

      const { vehicleId, name, detail, amount, price } = req.body;
      const parts = await Models.Parts.findByIdAndUpdate(
        partId,
        {
          vehicleId,
          name,
          detail,
          amount,
          price,
        },
        { new: true }
      );
      return SendSuccess(res, "Update Parts Successful", parts);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Update Parts");
    }
  }

  static async updatePartsImage(req,res) {
    try {
      const partId = req.params.partId;
      if (!mongoose.Types.ObjectId.isValid(partId)) {
        return SendError400(res, "Error ID Invalid");
      }
      const validate = ValidatePartsUpdateImage(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

      const { image, oldImage } = req.body;
      const imageUrl = await UploadImage(image, oldImage);
      if (!imageUrl) {
        return SendError400(res, "Error Upload Image");
      }

      const PartsUpdateImage = await Models.Parts.findByIdAndUpdate(
        partId,
        {
          image: imageUrl,
        },
        { new: true }
      ).populate({
        path: "vehicleId",
        selector: "vehicleType name is_Active createdAt updatedAt",
      });

      return SendSuccess(
        res,"Update Parts Image Successful", PartsUpdateImage);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Update Parts Image");
    }
  }

  static async deletePartsStatus(req,res) {
    try {
      const partId = req.params.partId;
      if (!mongoose.Types.ObjectId.isValid(partId)) {
        return SendError400(res, "Error ID Invalid");
      }
      const parts = await Models.Parts.findByIdAndUpdate(partId, {
        is_Active: false,
      },{new:true});
      return SendSuccess(res, "Delete Parts Status Successful", parts);
      
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Delete Parts Status");
    }
  }

  static async deletePart(req, res) {
    try {
      const partId = req.params.partId;
      if (!mongoose.Types.ObjectId.isValid(partId)) {
        return SendError400(res, "Error ID Invalid");
      }
      const parts = await Models.Parts.findByIdAndDelete(partId, {
        is_Active: false,
      },{new:true});
      return SendSuccess(res, "Delete Parts Successful", parts);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Delete Parts");
    }
  }
}
