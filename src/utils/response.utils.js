export const createResponse = (
  res,
  statusCode,
  message,
  data = null,
  error = null
) => {
  const body = {
    statusCode,
    message,
  };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  if (error !== null && error !== undefined) {
    body.error = error.toString();
  }

  return res.status(statusCode).json(body);
};
