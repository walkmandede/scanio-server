import prisma from "../database/prisma_client.js";
import { createResponse } from "../utils/response.utils.js";

export const getBrands = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const brands = await prisma.brand.findMany({
      where: { vendorId: user.vendorId },
    });

    createResponse(res, 200, "success", brands);
  } catch (err) {
    next(err);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, thumbnail } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const brand = await prisma.brand.create({
      data: {
        vendorId: user.vendorId,
        name,
        description,
        thumbnail,
      },
    });

    createResponse(res, 201, "Brand created", brand);
  } catch (err) {
    next(err);
  }
};

export const editBrand = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const brandId = parseInt(req.params.id);

    const { name, description, thumbnail, sortOrder } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        vendorId: user.vendorId,
      },
    });

    if (!brand) {
      return createResponse(res, 404, "Brand not found");
    }

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: {
        name,
        description,
        thumbnail,
        sortOrder,
      },
    });

    createResponse(res, 200, "Brand updated", updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const brandId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        vendorId: user.vendorId,
      },
    });

    if (!brand) {
      return createResponse(res, 404, "Brand not found");
    }

    await prisma.brand.delete({
      where: { id: brandId },
    });

    createResponse(res, 200, "Brand deleted");
  } catch (err) {
    next(err);
  }
};
