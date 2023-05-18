import mongoose from "mongoose";
import { StatusType } from "../service/message.js";
const OrderSchema = mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        require : true
    },
    partsId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "parts",
        require : true
    },
    priceTotal :{
        type: String,
        require : true
    },
    status :{
        type : String,
        value : Object.keys(StatusType),
        default : StatusType.await
    },
    is_Active :{
        type : Boolean,
        default : true,
    }
},{timestamps:true});
const Order = mongoose.model('order',OrderSchema);
export default Order;