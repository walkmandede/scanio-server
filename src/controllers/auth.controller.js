import prisma from "../database/prisma_client.js";
import { generatJwtToken } from "../utils/jwt.utils.js";
import { hashPassword, verifyPassword } from "../utils/password_crypt.utils.js";
import { createResponse } from "../utils/response.utils.js";

export const register = async (req, res, next) => {
  const {
    slogan,
    vendorName,
    address,
    logo,

    webPageKey,
    name,
    email,
    password,
  } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. create vendor
      var vendor = await tx.vendor.create({
        data: { name: vendorName, slogan: slogan, address, logo, webPageKey },
      });

      //2. create user
      await tx.user.create({
        data: {
          name,
          email,
          passwordHash: await hashPassword(password),
          vendor: {
            connect: { id: vendor.id },
          },
        },
      });
    });

    createResponse(res, 201, "Registration successful");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    var user = await prisma.user.findUnique({
      where: { email },
      include: { vendor: true },
    });

    if (!user) {
      return createResponse(res, 400, "Invalid email or password");
    }
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return createResponse(res, 400, "Invalid email or password");
    }

    var token = generatJwtToken(user.id);

    createResponse(res, 200, {
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    var user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
    });
    createResponse(res, 200, "success", user);
  } catch (error) {
    next(error);
  }
};
