import superLog from "../utils/super_log.js";
import prisma from "../database/prisma_client.js";
import { createResponse } from "../utils/response.utils.js";

export const getAllVendors = async (req, res, next) => {
  try {
    var result = await prisma.vendor.findMany();
    createResponse(res, 200, null, result);
  } catch (error) {
    next(error);
  }
};

export const createAVendor = async (req, res, next) => {
  superLog("asf");
};

export const editVendor = async (req, res, next) => {
  superLog("asf");
};

export const deleteVendor = async (req, res, next) => {
  superLog("asf");
};
