import UploadImage from "../config/cloudinary.js";
import  Models  from "../model/index.js";
import { Emessage } from "../service/message.js";
import { ValidateVehicle,ValidateUpdateVehicle,ValidateVehicleImage } from "../service/validate.js";
import {
  SendCreate,
  SendError400,
  SendError401,
  SendError500,
  SendError404,
  SendSuccess,
} from "../service/response.js";
import mongoose from "mongoose";
export class VehicleController {
  static async insert(req, res) {
    try {
      const { vehicleType, name, image } = req.body;
      const validate = ValidateVehicle(req.body);
      if (validate.length > 0) {
         SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

// ==========ການເຊັກບໍ່ໃຫ້ມີຊື່ຊ້ຳກັນ===================
      const checkDuppicate = await Models.Vehicle.findOne({
        name: name,
      });
      if (checkDuppicate) {
        return SendError400(res, "The Exit This name",name);
      }

      const imageUrl = await UploadImage(image);
      if (!imageUrl) {
         SendError400(res, "Your Must File Base64");
      }

// ===========ທຳການບັນທຶກຂໍ້ມູນ====================
      const vehicle = await Models.Vehicle.create({
        vehicleType,
        name,
        image: imageUrl,
      });
       SendCreate(res,"Insert Vehicle Successful", vehicle);
    } catch (error) {
      console.log(error);
       SendError500(res, "Error Insert Vehicle", error);
    }
  }
  static async getVehicleOne(req, res) {
    try {
      const VehicleId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(VehicleId)) {
        return SendError404(res, "Not Found Vehicle Id");
      }
      const vehicle = await Models.Vehicle.findOne();
       SendSuccess(res, "Get One Vehicle Successful", vehicle);
    } catch (error) {
      console.log(error);
       SendError500(res, "Error Get One Vehicle", error);
    }
  }
  static async getVehicleAll(req, res) {
    try {
      const vehicle = await Models.Vehicle.find({ is_Active: true });
      if (!vehicle) {
         SendError401(res, "Not Found Vehicle", vehicle);
      }
       SendSuccess(res, "Get All Vehicle Successful", vehicle);
    } catch (error) {
      console.log(error);
       SendError500(res, "Error Get All Vehicle", error);
    }
  }
  static async updateVehicle(req, res) {
    try {
        const VehicleId = req.params.VehicleId;
        if (!mongoose.Types.ObjectId.isValid(VehicleId)) {
          return SendError404(res, "Not Found Vehicle Id");
        }
        const { name, vehicleType } = req.body;
        const validate = ValidateUpdateVehicle(req.body);
        if (validate.length > 0) {
          return SendError400(res, Emessage.PleaseInput + validate.join(","));
        }
        const Vehicle = await Models.Vehicle.findByIdAndUpdate(
          VehicleId,
          {
            name,
            vehicleType,
          },
          { new: true }
        );
        return SendSuccess(res, "Update Vehicle Successfully", Vehicle);
      } catch (error) {
        console.log(error);
        return SendError500(res, "Can not Update Vehicle");
      }
  }

  static async updateVehicleImage(req, res) {
    try {
      const VehicleId = req.params.VehicleId;
      if (!mongoose.Types.ObjectId.isValid(VehicleId)) {
        return SendError404(res, "Not Found Vehicle Id");
      }
      const validate = ValidateVehicleImage(req.body);
      if (validate.length > 0) {
        return SendError404(res, Emessage.PleaseInput + validate.join(","));
      }
      const { image, oldImage } = req.body;
      const imageUrl = await UploadImage(image, oldImage);
      if (!imageUrl) {
        return SendError400(res, "Error Image Base64");
      }
      const Vehicle = await Models.Vehicle.findByIdAndUpdate(
        VehicleId,
        {
          image: imageUrl,
        },
        { new: true }
      );

      return SendSuccess(res, "Update Image Vehicle Successfully", Vehicle);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Update Vehicle Image", error);
    }
  }

  static async deleteVehicleStatus(req, res) {
    try {
      const VehicleId = req.params.VehicleId;
      if (!mongoose.Types.ObjectId.isValid(VehicleId)) {
        return SendError404(res, "Not Found Vehicle Id");
      }
      const Vehicle = await Models.Vehicle.findByIdAndUpdate(
        VehicleId,
        { is_Active: false },
        { new: true }
      );
      return SendSuccess(res, "Delete Image Vehicle Successfully", Vehicle);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Delete Vehicle Image", error);
    }
  }

  static async deleteVehicle(req, res) {
    try {
        const VehicleId = req.params.VehicleId;
        if (!mongoose.Types.ObjectId.isValid(VehicleId)) {
          return SendError404(res, "Not Found Vehicle Id");
        }
        const Vehicle = await Models.Vehicle.findByIdAndDelete(VehicleId);
        return SendSuccess(res, "Delete Vehicle Successfully", Vehicle);
      } catch (error) {
        console.log(error);
        return SendError500(res, "Can not Delete Vehicle", error);
      }
  }
}
