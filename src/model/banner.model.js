import mongoose from "mongoose";
const BannerSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    detail : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : ""
    },
    is_Active : {
        type : Boolean,
        default : true
    }
},{timestamps:true},);

const Banner = mongoose.model('banner',BannerSchema);
export default Banner;