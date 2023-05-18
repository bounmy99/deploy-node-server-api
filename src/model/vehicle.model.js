import mongoose from "mongoose";
const vehicleSchema = mongoose.Schema(
  {
    vehicleType: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: "",
    },
    is_Active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Vehicle = mongoose.model("vehicle", vehicleSchema);
export default Vehicle;
