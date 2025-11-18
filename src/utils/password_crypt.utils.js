import bcrypt from "bcryptjs";

export const hashPassword = async (password) => await bcrypt.hash(password, 10);
export const verifyPassword = async (password, hash) =>
  await bcrypt.compare(password, hash);
