import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import superLog from "./super_log.js";

export const generatJwtToken = (userId) => {
  const secret = JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret key is not defined in environment variables.");
  }

  superLog(JWT_EXPIRES_IN);

  const token = jwt.sign(
    {
      id: userId,
    },
    secret,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  return token;
};

export const decodeJwtToken = (jwtToken) => {
  const decodedPayload = jwt.verify(jwtToken, process.env.JWT_SECRET);
  return decodedPayload;
};
