import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProducts,
  toggleActiveStatus,
} from "../controllers/product.controller.js";

const productRouter = new express.Router();

productRouter
  .route("/")
  .get(authMiddleware, getProducts)
  .post(authMiddleware, createProduct);

productRouter
  .route("/:id")
  .put(authMiddleware, editProduct)
  .delete(authMiddleware, deleteProduct)
  .post(authMiddleware, toggleActiveStatus);

export default productRouter;
