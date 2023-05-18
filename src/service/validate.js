export const ValidateData = (data) => {
  return Object.keys(data).filter((key) => !data[key]);
};

export const ValidateRegister = (user) => {
  const { firstName, lastName, phoneNumber, password } = user;
  return ValidateData({ firstName, lastName, phoneNumber, password });
};

export const ValidateLogin = (user) => {
  const { phoneNumber, password } = user;
  return ValidateData({ phoneNumber, password });
};

export const ValidateUpdateUers = (user) => {
  const { firstName, lastName } = user;
  return ValidateData({ firstName, lastName });
};

export const ValidateUpdateUserProfile = (user) => {
  const { image } = user;
  return ValidateData({ image });
};

//====================Banner=======================

export const ValidateBanner = (banner) => {
  const { name,detail,image } = banner;
  return ValidateData({ name,detail,image });
};

export const ValidateUpdateBanner = (banner) => {
  const { name,detail } = banner;
  return ValidateData({ name,detail });
};

export const ValidateBannerImage = (banner) => {
  const { image } = banner;
  return ValidateData({ image });
};

//====================Vehicle=======================

export const ValidateVehicle = (vehicle) => {
  const { vehicleType, name, image } = vehicle;
  return ValidateData({ vehicleType, name, image });
};

export const ValidateUpdateVehicle = (vehicle) => {
  const { vehicleType, name} = vehicle;
  return ValidateData({ vehicleType, name});
};

export const ValidateVehicleImage = (vehicle) => {
  const { image } = vehicle;
  return ValidateData({image})
}

// =================Parts=======================

export const ValidateParts = (parts) => {
  const { vehicleId,name, detail,amount,price, image } = parts;
  return ValidateData({ vehicleId,name,amount,price, detail, image });
};

export const ValidatePartsUpdate = (parts) => {
  const { vehicleId,name, detail,amount,price } = parts;
  return ValidateData({ vehicleId,name,amount,price, detail});
};

export const ValidatePartsUpdateImage = (parts) => {
  const { image,oldImage } = parts;
  return ValidateData({ image,oldImage });
};

// ====================Order===================

export const ValidateOrder = async(order) =>{
  const {userId,partsId,priceTotal} = order;
  return ValidateData({userId,partsId,priceTotal});
}