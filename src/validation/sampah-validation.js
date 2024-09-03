import Joi from "joi";

const createSampahValidation = Joi.object({
  kategori_sampah: Joi.string().max(255).required(),
  satuan_sampah: Joi.string().max(50).required(),
  harga: Joi.number().required(),
});

const getSampahValidation = Joi.string().required();

export { createSampahValidation, getSampahValidation };
