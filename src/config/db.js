import mongoose from "mongoose";
import {URL_DATABASE_DEV,URL_DATABASE_PRODUCT} from "./globalKey.js";
mongoose.connect(URL_DATABASE_PRODUCT).then(()=>{
    console.log("connected successfuly");
}).catch(()=>{
    console.log("cannot Connet Database");
})