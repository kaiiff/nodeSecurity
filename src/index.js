const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 4007;
const v1UserRoutes = require("./module/v1/user/routers/userRouter")
const v1AdminRoutes = require("./module/v1/admin/router/adminRouter")

//Database connection calling here
const Database = require("./utils/dbConnection");
Database();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/v1/users", limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public/images")));

app.use("/api/v1/users",v1UserRoutes );
app.use("/api/v1/admin",v1AdminRoutes)

app.listen(port, () => {
  console.log(`Server start successfully on port: ${port}`);
});
