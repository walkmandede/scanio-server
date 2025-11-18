import express from "express";
import { PORT, NODE_ENV, DATABASE_URL } from "./config/env.js";
import superLog from "./utils/super_log.js";
import { errorHandler } from "./middlewares/error_handler.middleware.js";

import vendorRouter from "./routes/vendor.route.js";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import brandRouter from "./routes/brand.route.js";
import productRouter from "./routes/product.route.js";

const app = express();
const apiPrefix = "/api/v1";

//uses
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//landing route

app.get("", (req, res) => {
  res.send({ status: true, message: "Welcome to Subscription Tracker" });
});

app.get(`${apiPrefix}`, (req, res) => {
  res.send({ status: true, message: "Welcome to Subscription Tracker API" });
});

//api routes
app.use(`${apiPrefix}/vendor`, vendorRouter);
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/category`, categoryRouter);
app.use(`${apiPrefix}/brand`, brandRouter);
app.use(`${apiPrefix}/product`, productRouter);

//checkers
superLog(`PROJ_ENV: ${NODE_ENV}`);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running in http://localhost:${PORT}/`);
  console.log(`DB is ${DATABASE_URL}`);
});

//errors
app.use(errorHandler);

export default app;
