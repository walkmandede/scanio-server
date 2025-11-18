import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  getAllVendors,
  createAVendor,
  editVendor,
  deleteVendor,
} from "../controllers/vendor.controller.js";

const vendorRouter = new express.Router();

vendorRouter.route("/").get(getAllVendors);

vendorRouter
  .route("/:id")
  .get(authMiddleware, getAllVendors)
  .put(authMiddleware, editVendor)
  .delete(authMiddleware, deleteVendor);

export default vendorRouter;
