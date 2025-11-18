import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  deleteBrand,
  editBrand,
  getBrands,
} from "../controllers/brand.controller.js";

const brandRouter = new express.Router();

brandRouter
  .route("/")
  .get(authMiddleware, getBrands)
  .post(authMiddleware, createBrand);

brandRouter
  .route("/:id")
  .put(authMiddleware, editBrand)
  .delete(authMiddleware, deleteBrand);

export default brandRouter;
