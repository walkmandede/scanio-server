import { formatError } from "../utils/error_formatter.utils.js";
import { createResponse } from "../utils/response.utils.js";
import superLog from "../utils/super_log.js";

export const errorHandler = (err, req, res, next) => {
  superLog(err);

  let statusCode = 500;
  let message = "Something went wrong. Please try again.";

  // Handle Prisma known errors
  if (err.name && err.name.startsWith("Prisma")) {
    statusCode = 400; // Bad Request
    message = formatError(err);
  }

  // Optional: handle custom errors with statusCode
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return createResponse(res, statusCode, message);
};
