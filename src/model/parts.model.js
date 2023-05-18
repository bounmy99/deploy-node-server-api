import mongoose, { Mongoose } from "mongoose";
const PartsSchema = mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    vehicleId :{
        type : mongoose.Types.ObjectId,
        ref  : "vehicle",
        required : true
    },
    detail:{
        type : String,
        default : ""
    },
    amount:{
        type : Number,
        required : true
    },
    price:{
        type : Number,
        default : 0.0
    },
    image :{
        type : String,
        default : ""
    },
    is_Active:{
        type : Boolean,
        default : true
    }
},{timestamps:true})

const Parts = mongoose.model("parts" , PartsSchema);
export default Parts