import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SECRET_KEY } from "../config/globalKey.js";
import Models from "../model/index.js";
export const GenerateToken = (user) => {
  return new Promise(async (resovle, reject) => {
    try {
      let token = jwt.sign(
        {
          _id: user._id,
          phoneNumber: user.phoneNumber,
        },
        `${SECRET_KEY}`,
        { expiresIn: "12h" }
      );

      resovle({ token });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const ComparePassword = (password, userPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      bcrypt.compare(password, userPassword, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const VerifyToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, SECRET_KEY, function (err, isMatch) {
        if (err) return reject(err);
        resolve({ isMatch });
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const CheckPriceRef = (partsId, priceTotal) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parts = await Models.Parts.findOne({
        _id: partsId,
        is_Active: true,
      });
// ປຽ່ນ String ເປັນ Number
      priceTotal = parseInt(priceTotal);
      parts.price = parseInt(parts.price);

      if (priceTotal != parts.price) {
        return reject(new Error("Not Match PricesTotal"));
      }
      return resolve(parts);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};
