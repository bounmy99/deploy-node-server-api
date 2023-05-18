import Models from "../model/index.js";
import { Emessage, StatusType } from "../service/message.js";
import {
  SendCreate,
  SendError400,
  SendError404,
  SendError500,
  SendSuccess,
} from "../service/response.js";
import { CheckPriceRef } from "../service/service.js";
import { ValidateOrder } from "../service/validate.js";
import mongoose from "mongoose";

export default class OrderController {
  static async insertOrder(req, res) {
    try {
      const validate = ValidateOrder(req.body);
      if (validate.length > 0) {
        return SendError400(
          res,
          Emessage.PleaseInput + " " + validate.join(",")
        );
      }
      const { orderId, partsId, priceTotal } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(orderId) ||
        !mongoose.Types.ObjectId.isValid(partsId)
      ) {
        return SendError404(res, "Not Found orderId Or partsId");
      }

      let parts = await CheckPriceRef(partsId, priceTotal);

      if (!parts) {
        return SendError400(res, "Error Price");
      }

      const order = await Models.Order.create(
        {
          orderId,
          partsId,
          priceTotal,
        },
        { new: true }
      );
      return SendCreate(res, "Inset Order Successfully", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can not Insert Order", error);
    }
  }

  static async getAllOrder(req, res) {
    try {
      const GetAllOrder = await Models.Order.find({ is_Active: true }).populate(
        {
          path: "userId partsId",
          select:
            "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt ",
        }
        
      );
      if (!GetAllOrder) {
        return SendError404(res, "Can't Found Orders");
      }
      return SendSuccess(res, "Get All Order Successfully", GetAllOrder);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can't Get All Orders");
    }
  }

  static async getOneOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Can't Found Order ID");
      }
      const Order = await Models.Order.findOne({
        _id: orderId,
        is_Active: true,
      }).populate(
        {
          path: "userId partsId",
          select:
            "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt ",
        }
        
      );
      return SendSuccess(res, "Get One Order Successfully", Order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Can't Get One Order");
    }
  }

  static async getOrderStatusAwait(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Not Found User ID");
      }
      const order = await Models.Order.findOne({
        _id: orderId,
        is_Active: true,
        status: StatusType.await,
      }).populate({
        path: "userId partsId",
        select:
          "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt",
      });
      return SendSuccess(res, "Get Order Status Await Successful", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get One Order Status Await", error);
    }
  }
  static async getOrderStatusPadding(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Not Found User ID");
      }
      const order = await Models.Order.findOne({
        is_Active: true,
        _id: orderId,
        status: StatusType.padding,
      },{ new: true }).populate(
        {
          path: "userId partsId",
          select:
            "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt ",
        }
        
      );
      return SendSuccess(res, "Get Order Status Padding Successful", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get One Order Status Padding", error);
    }
  }
  static async getOrderStatusSuccess(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Not Found User ID");
      }
      const order = await Models.Order.findOne({
        is_Active: true,
        _id: orderId,
        status: StatusType.success,
      }).populate({
        path: "userId partsId",
        select:
          "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt ",
      });
      return SendSuccess(res, "Get Order Status Success", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get One Order Status Success", error);
    }
  }
  static async getOrderStatusCancel(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Not Found User ID");
      }
      const order = await Models.Order.findOne({
        is_Active: true,
        _id: orderId,
        status: StatusType.cancel,
      }).populate({
        path: "userId partsId",
        select:
          "fisrtName lastName phoneNumber profile createdAt updatedAt name detail amount price image createdAt updatedAt ",
      });
      return SendSuccess(res, "Get Order Status Cancel Successful", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Get One Order Status Cancel", error);
    }
  }
  static async updateOrderStatusPadding(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return SendError404(res, "Not Found Order ID");
      }
      const order = await Models.Order.findByIdAndUpdate(
        orderId,
        {
          status: StatusType.padding,
        },
        { new: true }
      );
      if (!order) {
        return SendError404(res, "Not Found Order ID");
      }
      return SendSuccess(res, "Update Status Padding Successful", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Update Status Padding", error);
    }
  }
  static async updateOrderStatusSuccess(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        SendError404(res, "Not Found Order ID");
      }
      const order = await Models.Order.findByIdAndUpdate(
        orderId,
        {
          status: StatusType.success,
        },
        { new: true }
      );
      return SendSuccess(res, "Update Status Success", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Update Status Success", error);
    }
  }
  static async updateOrderStatusCancel(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        SendError404(res, "Not Found Order ID");
      }
      const order = await Models.Order.findByIdAndUpdate(
        orderId,
        {
          status: StatusType.cancel,
        },
        { new: true }
      );
      return SendSuccess(res, "Update Status Cancel", order);
    } catch (error) {
      console.log(error);
      return SendError500(res, "Error Update Status Cancel", error);
    }
  }

  static async deleteOrder(req,res){
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
       return SendError404(res, "Not Found Order ID");
      }
      const order = await Models.Order.findByIdAndDelete(orderId);
      return SendSuccess(res, "Delete Order Successfully", order);
    } catch (error) {
      console.log(error);
      return SendError500(res,"Can't Delete Order")
    }
  }
}
