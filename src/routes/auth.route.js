import express from "express";
import { login, register, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = new express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/profile").get(authMiddleware, getProfile);
authRouter.route("/test").get((req, res, next) => {
  res.send({ status: true, message: "Welcome to Subscription Tracker API []" });
});

export default authRouter;
