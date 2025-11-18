import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import superLog from "../utils/super_log.js";
import { createResponse } from "../utils/response.utils.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    superLog(authHeader);
    superLog(authHeader.split(" "));

    const token = authHeader.split(" ")[1];
    superLog(token);
    superLog(token.length);

    if (!token || authHeader.split(" ").length !== 2) {
      return createResponse(res, 401, `Token format is "Bearer <token>".`);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
