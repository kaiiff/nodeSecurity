const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 4007;
const routes = require("./router/index");

//Database connection calling here
const Database = require("./utils/dbConnection");
Database();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public/images")));

app.use("/api", routes.userRoute);

app.listen(port, () => {
  console.log(`Server start successfully on port: ${port}`);
});
