// src/service/sampah-service.js
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { createSampahValidation } from "../validation/sampah-validation.js";
import { validate } from "../validation/validation.js";

const create = async (user, request) => {
  if (!user || user.id_role !== 2) {
    throw new ResponseError(403, "Access denied");
  }

  const userData = await prismaClient.user.findUnique({
    where: {
      id_user: user.id_user,
    },
    include: {
      bank_sampah: true,
    },
  });

  if (!userData) {
    throw new ResponseError(404, "User not found");
  }

  const sampah = validate(createSampahValidation, request);
  sampah.id_user = userData.id_user;
  sampah.id_bank_sampah = userData.bank_sampah?.id_bank_sampah;

  if (!sampah.id_bank_sampah) {
    throw new ResponseError(400, "Bank Sampah not associated with the user");
  }

  try {
    const createdSampah = await prismaClient.sampah.create({
      data: sampah,
      select: {
        id_sampah: true,
        kategori_sampah: true,
        satuan_sampah: true,
        harga: true,
        id_bank_sampah: true,
        id_user: true,
      },
    });
    return {
      status: 201,
      message: "Sampah created successfully",
      data: createdSampah,
    };
  } catch (error) {
    throw new ResponseError(500, "Internal server error");
  }
};

const getAllSampahByUserBankSampah = async (user) => {
  const userData = await prismaClient.user.findUnique({
    where: {
      id_user: user.id_user,
    },
    include: {
      nasabah: true,
      bank_sampah: true,
    },
  });

  if (!userData) {
    throw new ResponseError(404, "User not found");
  }

  let idBankSampah;

  if (userData.nasabah) {
    idBankSampah = userData.nasabah.id_bank_sampah;
  } else if (userData.bank_sampah) {
    idBankSampah = userData.bank_sampah.id_bank_sampah;
  } else {
    throw new ResponseError(
      404,
      "No associated Bank Sampah found for this user"
    );
  }

  try {
    const sampahList = await prismaClient.sampah.findMany({
      where: {
        id_bank_sampah: idBankSampah,
      },
      select: {
        id_sampah: true,
        kategori_sampah: true,
        satuan_sampah: true,
        harga: true,
        id_bank_sampah: true,
        id_user: true,
      },
    });

    return {
      status: 200,
      message: "Sampah list retrieved successfully",
      data: sampahList,
    };
  } catch (error) {
    throw new ResponseError(500, "Internal server error");
  }
};

export default { create, getAllSampahByUserBankSampah };
