const express = require("express");
const connection = require("./Database/connection");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const verifyToken = require("./Middleware/Middleware");
// const verifyToken = require("./Middlewares/middleware");
require("dotenv").config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connection
  .connect()
  .then((res) => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.get("/", verifyToken, (req, res) => {
  res.send("Jiggasha Koro!");
});

app.post("/signup", (req, res) => {
  const { name, email, password, mobile, username } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      connection.query(
        "INSERT INTO users (full_name, user_email, user_password, mobile_no, user_name) VALUES ($1, $2, $3, $4, $5)",
        [name, email, hashedPassword, mobile, username],
        (err, results) => {
          if (err) {
            return res.status(500).json({ Error: "Error registering user" });
          }
          return res.json({ status: "Success" });
        }
      );
    })
    .catch((error) => {
      return res.json({ Error: "Error hashing password" });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE user_name = $1",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ Error: "Error during query" });
      }
      if (results.rows.length > 0) {
        bcrypt.compare(
          password,
          results.rows[0].user_password,
          (err, response) => {
            if (err) return res.json({ Error: "Error comparing password" });
            if (response) {
              const uid = results.rows[0].id;
              const token = jwt.sign(
                { id: uid, type: "user" },
                `${process.env.JWT_SECRET}`,
                {
                  expiresIn: `${process.env.JWT_EXPIRES_IN}`,
                }
              );

              const cookieOptions = {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "development",
                sameSite: "Lax",
                path: "/",
              };

              res.cookie(`${process.env.COOKIE_NAME}`, token, cookieOptions);

              return res.json({ status: "Success" });
            } else {
              return res.json({ Error: "Password incorrect" });
            }
          }
        );
      } else {
        res.json({ Error: "No user exists" });
      }
    }
  );
  // res.send(`${req.query.username}, ${req.query.password}`);
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
