import prisma from "../database/prisma_client.js";
import { createResponse } from "../utils/response.utils.js";

export const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const categories = await prisma.category.findMany({
      where: { vendorId: user.vendorId },
    });

    createResponse(res, 200, "success", categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, thumbnail } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const category = await prisma.category.create({
      data: {
        vendorId: user.vendorId,
        name,
        description,
        thumbnail,
      },
    });

    createResponse(res, 201, "Category created", category);
  } catch (err) {
    next(err);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categoryId = parseInt(req.params.id);

    const { name, description, thumbnail, sortOrder } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    // ensure category belongs to vendor
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        vendorId: user.vendorId,
      },
    });

    if (!category) {
      return createResponse(res, 404, "Category not found");
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
        thumbnail,
        sortOrder,
      },
    });

    createResponse(res, 200, "Category updated", updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categoryId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        vendorId: user.vendorId,
      },
    });

    if (!category) {
      return createResponse(res, 404, "Category not found");
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    createResponse(res, 200, "Category deleted");
  } catch (err) {
    next(err);
  }
};
