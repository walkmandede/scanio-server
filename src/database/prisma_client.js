import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client.ts";

dotenv.config({ path: ".env/.env.development.local" });

const prisma = new PrismaClient();

export default prisma;
