const express = require("express");
const connection = require("./Database/Connection");
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

app.get("/", verifyToken, async (req, res) => {
  try { 
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID" });
    }

    const query = `
        SELECT 
          full_name, username, email, mobile_no, user_role, 
          user_class_level, user_group, user_department, user_picture, user_rating
        FROM users
        WHERE user_id = $1
      `;

    const { rows } = await connection.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", (req, res) => {
  const {
    name,
    username,
    email,
    password,
    mobile,
    role,
    classLevel,
    group,
    department,
  } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ Error: "Database error" });
      }
      if (results.rows.length > 0) {
        return res.status(400).json({ Error: "Username already taken" });
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          connection.query(
            "INSERT INTO users (full_name, username, email, password, mobile_no, user_role, user_class_level, user_group, user_department) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [
              name,
              username,
              email,
              hashedPassword,
              mobile,
              role,
              classLevel,
              group || null,
              department || null,
            ],
            (err, results) => {
              if (err) {
                console.error("Database insertion error:", err);
                return res
                  .status(500)
                  .json({ Error: "Error registering user" });
              }
              return res.json({ status: "Success" });
            }
          );
        })
        .catch((error) => {
          console.error("Password hashing error:", error);
          return res.status(500).json({ Error: "Error hashing password" });
        });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ Error: "Username and password are required" });
  }

  connection.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ Error: "Error during query" });
      }

      if (results.rows.length === 0) {
        return res.status(401).json({ Error: "Invalid credentials" });
      }

      const user = results.rows[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ Error: "Error comparing password" });
        }

        if (!isMatch) {
          return res.status(401).json({ Error: "Invalid credentials" });
        }

        // User authenticated successfully
        const uid = user.user_id;
        const token = jwt.sign({ id: uid }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });

        const cookieOptions = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "development",
          sameSite: "Lax",
          path: "/",
        };

        res.cookie(process.env.COOKIE_NAME, token, cookieOptions);

        return res.status(200).json({
          status: "Success",
          user: {
            id: user.user_id,
            name: user.user_full_name,
            role: user.user_role,
          },
        });
      });
    }
  );
});

app.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  return res.status(200).json({ status: "Success" });
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
