import Models from "../model/index.js";
import { Emessage } from "../service/message.js";
import {
  SendCreate,
  SendError400,
  SendError500,
  SendSuccess,
  SendError404,
} from "../service/response.js";
import {
  ValidateBanner,
  ValidateUpdateBanner,
  ValidateBannerImage,
} from "../service/validate.js";
import UploadImage from "../config/cloudinary.js";
import mongoose from "mongoose";

export default class BannerController {
  static async insert(req, res) {
    try {
      const validate = ValidateBanner(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }

      const checkDuppicate = await Models.Banner.findOne({
        name: name,
      });
      if (checkDuppicate) {
        return SendError400(res, "The Exit This name",name);
      }

      const { name, detail, image } = req.body;

      const imageUrl = await UploadImage(image);
      if (!imageUrl) {
        return SendError400(res, "Error Image Base64");
      }
      const banner = await Models.Banner.create({
        name,
        detail,
        image: imageUrl,
      });

      return SendCreate(res, "Insert Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Banner Insert", error);
    }
  }

  static async getAllBanner(req, res) {
    try {
      const banner = await Models.Banner.find();
      return SendSuccess(res, "Get All Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Get All Banner");
    }
  }

  static async getOneBanner(req, res) {
    try {
      const bannerId = req.params.bannerId;
      if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return SendError404(res, "Not Found Banner Id");
      }
      const banner = await Models.Banner.findOne();
      return SendSuccess(res, "Get One Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not One All Banner");
    }
  }

  static async updateBanner(req, res) {
    try {
      const bannerId = req.params.bannerId;
      if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return SendError404(res, "Not Found Banner Id");
      }
      const { name, detail } = req.body;
      const validate = ValidateUpdateBanner(req.body);
      if (validate.length > 0) {
        return SendError400(res, Emessage.PleaseInput + validate.join(","));
      }
      const banner = await Models.Banner.findByIdAndUpdate(
        bannerId,
        {
          name,
          detail,
        },
        { new: true }
      );
      return SendSuccess(res, "Update Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Update Banner");
    }
  }

  static async updateBannerImage(req, res) {
    try {
      const bannerId = req.params.bannerId;
      if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return SendError404(res, "Not Found Banner Id");
      }
      const validate = ValidateBannerImage(req.body);
      if (validate.length > 0) {
        return SendError404(res, Emessage.PleaseInput + validate.join(","));
      }
      const { image, oldImage } = req.body;
      const imageUrl = await UploadImage(image, oldImage);
      if (!imageUrl) {
        return SendError400(res, "Error Image Base64");
      }
      const banner = await Models.Banner.findByIdAndUpdate(
        bannerId,
        {
          image: imageUrl,
        },
        { new: true }
      );

      return SendSuccess(res, "Update Image Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Update Banner Image", error);
    }
  }

  static async deleteBannerStatus(req, res) {
    try {
      const bannerId = req.params.bannerId;
      if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return SendError404(res, "Not Found Banner Id");
      }
      const banner = await Models.Banner.findByIdAndUpdate(
        bannerId,
        { is_Active: false },
        { new: true }
      );
      return SendSuccess(res, "Delete Image Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Delete Banner Image", error);
    }
  }

  static async deleteBanner(req, res) {
    try {
      const bannerId = req.params.bannerId;
      if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return SendError404(res, "Not Found Banner Id");
      }
      const banner = await Models.Banner.findByIdAndDelete(bannerId);
      return SendSuccess(res, "Delete Banner Successfully", banner);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Delete Banner", error);
    }
  }
}
