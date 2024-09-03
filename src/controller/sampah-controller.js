// src/controller/sampah-controller.js
import sampahService from "../service/sampah-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await sampahService.create(user, request);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const getSampahList = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await sampahService.getAllSampahByUserBankSampah(user);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, getSampahList };
