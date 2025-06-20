const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const connection = require("./config/database");
const app = express();
// DB connection
connection
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

const allowedOrigins = ["http://localhost:3000", "https://jiggasha.vercel.app"];

app.use(cookieParser());
app.use(
  cors({
    origin: "https://jiggasha.vercel.app",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", routes);

module.exports = app;
