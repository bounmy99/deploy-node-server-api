import  express  from "express";
import AuthController from "../controller/auth.controller.js";
import { auth } from "../middleware/auth.js";
import BannerController from "../controller/banner.controller.js";
import { VehicleController } from "../controller/vehicle.controller.js";
import  PartsController  from "../controller/parts.controller.js"
import OrderController from "../controller/order.controller.js";
const router = express.Router();
//============auth=============
router.get("/user/getOneUser/:userId",auth,AuthController.getOneUser);
router.get("/user/getAllUser",auth,AuthController.GetAllUser);
router.post("/user/register", AuthController.register);
router.post("/user/login", AuthController.login);
router.put("/user/updateUser/:userId",auth, AuthController.updateUser);
router.put("/user/updateUserProfile/:userId",auth, AuthController.updateUserProfile);
router.put("/user/deleteUser/:userId",auth,AuthController.deleteUser)

//=========Banner===============
router.post("/banner/insertbanner",auth,BannerController.insert);
router.get("/banner/getAllBanner",auth,BannerController.getAllBanner);
router.get("/banner/getOneBanner/:bannerId",auth,BannerController.getOneBanner);
router.put("/banner/updateBanner/:bannerId",auth,BannerController.updateBanner);
router.put("/banner/updateBannerImage/:bannerId",auth,BannerController.updateBannerImage);
router.put("/banner/deleteBannerStatus/:bannerId",auth,BannerController.deleteBannerStatus);
router.delete("/banner/deleteBanner/:bannerId",auth,BannerController.deleteBanner);

//=========Vehicle===============
router.post("/Vehicle/insertVehicle",auth,VehicleController.insert);
router.get("/Vehicle/getAllVehicle",auth,VehicleController.getVehicleAll);
router.get("/Vehicle/getOneVehicle/:VehicleId",auth,VehicleController.getVehicleOne);
router.put("/Vehicle/updateVehicle/:VehicleId",auth,VehicleController.updateVehicle);
router.put("/Vehicle/updateVehicleImage/:VehicleId",auth,VehicleController.updateVehicleImage);
router.put("/Vehicle/deleteVehicleStatus/:VehicleId",auth,VehicleController.deleteVehicleStatus);
router.delete("/Vehicle/deleteVehicle/:VehicleId",auth,VehicleController.deleteVehicle);

// ========Parts=================
router.post("/Parts/insertParts",auth,PartsController.insert);
router.get("/Parts/getOneParts/:partId",auth,PartsController.getOne);
router.get("/Parts/getAllParts",auth,PartsController.getAll);
router.put("/Parts/updateParts/:partId",auth,PartsController.updateParts);
router.put("/Parts/updatePartsImage/:partId",auth,PartsController.updatePartsImage);
router.put("/Parts/deletePartsStatus/:partId",auth,PartsController.deletePartsStatus);
router.delete("/Parts/deleteParts/:partId",auth,PartsController.deletePart);

// =======Order==============
router.post("/Order/insertOrder",auth,OrderController.insertOrder);
router.get("/Order/getAllOrder",auth,OrderController.getAllOrder);
router.get("/Order/getOneOrder/:orderId",auth,OrderController.getOneOrder);
router.get("/order/getOrderStatusAwait/:orderId", auth, OrderController.getOrderStatusAwait);
router.get("/order/getOrderStatusPadding/:orderId", auth, OrderController.getOrderStatusPadding);
router.get("/order/getOrderStatusSuccess/:orderId", auth, OrderController.getOrderStatusSuccess);
router.get("/order/getOrderStatusCancel/:orderId", auth, OrderController.getOrderStatusCancel);
router.put("/order/updateStatusPadding/:orderId", auth, OrderController.updateOrderStatusPadding);
router.put("/order/updateStatusSuccess/:orderId", auth, OrderController.updateOrderStatusSuccess);
router.put("/order/updateStatusCancel/:orderId", auth, OrderController.updateOrderStatusCancel);
router.delete("/order/deleteOrder/:orderId", auth, OrderController.deleteOrder);
export default router;
