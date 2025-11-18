import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from "../controllers/category.controller.js";

const categoryRouter = new express.Router();

categoryRouter
  .route("/")
  .get(authMiddleware, getCategories)
  .post(authMiddleware, createCategory);

categoryRouter
  .route("/:id")
  .put(authMiddleware, editCategory)
  .delete(authMiddleware, deleteCategory);

export default categoryRouter;
