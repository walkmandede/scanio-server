import prisma from "../database/prisma_client.js";
import { createResponse } from "../utils/response.utils.js";

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      rowsPerPage = 30,
      brandId,
      categoryId,
      keyword,
    } = req.query;

    //pagination varaibles
    const skip = (Number(page) - 1) * Number(rowsPerPage);
    const take = Number(rowsPerPage);

    //filter
    const where = {};

    if (brandId) {
      where.brandId = Number(brandId);
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }

    //fetch vendor
    const userId = req.user?.id;
    let vendorFilter = {};

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { vendor: true },
      });

      if (user?.vendorId) {
        vendorFilter.vendorId = user.vendorId;
      }
    }

    //vendor filter + user filters
    const finalWhere = {
      ...vendorFilter,
      ...where,
    };

    //prisma query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: finalWhere,
        skip,
        take,
        orderBy: { name: "desc" },
        include: {
          brand: true,
          category: true,
        },
      }),
      prisma.product.count({ where: finalWhere }),
    ]);

    const totalPages = Math.ceil(total / rowsPerPage);

    return createResponse(res, 200, "success", {
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
      total,
      totalPages,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      name,
      description,
      basePrice,
      salePrice,
      brandId,
      categoryId,
      images = [],
      variants = [],
    } = req.body;

    //Get vendorId from authenticated user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    if (!user || !user.vendorId) {
      return createResponse(res, 400, "Invalid vendor or unauthorized user");
    }

    const vendorId = user.vendorId;

    //prisma query
    const newProduct = await prisma.product.create({
      data: {
        vendorId,
        name,
        description,
        basePrice: Number(basePrice),
        salePrice: Number(salePrice),
        brandId: brandId ? Number(brandId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        images: Array.isArray(images) ? images : [],

        //create variants
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            description: v.description,
            basePrice: Number(v.basePrice),
            salePrice: Number(v.salePrice),
            isActive: v.isActive ?? true,
            isHidden: v.isHidden ?? false,
          })),
        },
      },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });

    return createResponse(res, 201, "Product created successfully", newProduct);
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);
    const {
      name,
      description,
      basePrice,
      salePrice,
      brandId,
      categoryId,
      images,
      variants,
    } = req.body;

    //get vendorId from logged-in user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    if (!user?.vendorId) {
      return createResponse(res, 400, "Vendor not found");
    }

    const vendorId = user.vendorId;

    //validation-product
    const existing = await prisma.product.findFirst({
      where: { id: productId, vendorId },
      include: { variants: true },
    });

    if (!existing) {
      return createResponse(res, 404, "Product not found for this vendor");
    }

    //validation-brand
    if (brandId !== undefined && brandId !== null) {
      const brand = await prisma.brand.findFirst({
        where: {
          id: Number(brandId),
          vendorId,
        },
      });

      if (!brand) {
        return createResponse(
          res,
          400,
          "Brand does not exist or does not belong to this vendor"
        );
      }
    }

    //validation-category
    if (categoryId !== undefined && categoryId !== null) {
      const category = await prisma.category.findFirst({
        where: {
          id: Number(categoryId),
          vendorId,
        },
      });

      if (!category) {
        return createResponse(
          res,
          400,
          "Category does not exist or does not belong to this vendor"
        );
      }
    }

    //payload
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (basePrice !== undefined) updateData.basePrice = Number(basePrice);
    if (salePrice !== undefined) updateData.salePrice = Number(salePrice);
    if (brandId !== undefined)
      updateData.brandId = brandId ? Number(brandId) : null;
    if (categoryId !== undefined)
      updateData.categoryId = categoryId ? Number(categoryId) : null;
    if (images !== undefined) updateData.images = images;

    //update-variants
    let variantUpdate = {};
    if (Array.isArray(variants)) {
      //delete old variants, create new ones
      variantUpdate = {
        deleteMany: {},
        create: variants.map((v) => ({
          name: v.name,
          description: v.description,
          basePrice: Number(v.basePrice),
          salePrice: Number(v.salePrice),
          isActive: v.isActive ?? true,
          isHidden: v.isHidden ?? false,
        })),
      };
    }

    //update-product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        ...(Array.isArray(variants) ? { variants: variantUpdate } : {}),
      },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });

    return createResponse(
      res,
      200,
      "Product updated successfully",
      updatedProduct
    );
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);

    //get vendorId from logged-in user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    if (!user?.vendorId) {
      return createResponse(res, 400, "Vendor not found");
    }

    const vendorId = user.vendorId;

    //check product exists AND belongs to this vendor
    const existing = await prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!existing) {
      return createResponse(
        res,
        404,
        "Product not found or does not belong to your vendor"
      );
    }

    //delete product (variants auto-deleted due to relation)
    await prisma.product.delete({
      where: { id: productId },
    });

    return createResponse(res, 200, "Product deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const toggleActiveStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);

    //get vendorId of logged-in user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });

    if (!user?.vendorId) {
      return createResponse(res, 400, "Vendor not found");
    }

    const vendorId = user.vendorId;

    //find the product belonging to this vendor
    const product = await prisma.product.findFirst({
      where: { id: productId, vendorId },
    });

    if (!product) {
      return createResponse(
        res,
        404,
        "Product not found or does not belong to your vendor"
      );
    }

    //toggle isActive
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isActive: !product.isActive },
    });

    return createResponse(
      res,
      200,
      `Product isActive status toggled to ${updatedProduct.isActive}`,
      updatedProduct
    );
  } catch (err) {
    next(err);
  }
};
