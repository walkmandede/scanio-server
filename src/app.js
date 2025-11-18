import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
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
app.use(express.json());

//landing route
app.get(`${apiPrefix}`, (req, res) => {
  res.send({ status: true, message: "Welcome to Subscription Tracker" });
});

//api routes
app.use(`${apiPrefix}/vendor`, vendorRouter);
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/category`, categoryRouter);
app.use(`${apiPrefix}/brand`, brandRouter);
app.use(`${apiPrefix}/product`, productRouter);

//checkers
superLog(`PROJ_ENV: ${NODE_ENV}`);

app.listen(PORT, async () => {
  console.log(`Server is running in http://localhost:${PORT}/`);
});

//errors
app.use(errorHandler);

export default app;
