export const formatError = (error) => {
  // Prisma Validation Error: wrong field or missing required field
  if (error.name === "PrismaClientValidationError") {
    // Try to extract the unknown field
    const match = error.message.match(/Unknown argument `(.+?)`/);
    if (match) {
      return `Invalid field '${match[1]}' in request.`;
    }
    return "Invalid input data. Please check your request.";
  }

  // Prisma Unique Constraint Error
  if (error.code === "P2002") {
    const field = error.meta?.target?.join(", ") || "field";
    return `The value for '${field}' already exists.`;
  }

  // Prisma Record Not Found
  if (error.code === "P2025") {
    return "Requested resource was not found.";
  }

  // Prisma Foreign Key Constraint
  if (error.code === "P2003") {
    return "Invalid reference to another resource.";
  }

  // Default fallback
  return "Something went wrong. Please try again.";
};
