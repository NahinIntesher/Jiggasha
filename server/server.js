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
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
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

// Setup your transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or SendGrid, SES, etc.
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route: Forgot Password
app.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Error: errors.array()[0].msg });
    }

    const { email } = req.body;

    try {
      // Check if user exists
      const userResult = await connection.query(
        "SELECT user_id, username FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        // Don't reveal if the email exists (for security)
        return res.status(200).json({
          status: "Success",
          message:
            "If your email is registered, you will receive password reset instructions.",
        });
      }

      const user = userResult.rows[0];

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Delete old tokens for user
      await connection.query("DELETE FROM reset_tokens WHERE user_id = $1", [
        user.user_id,
      ]);

      // Save new token
      await connection.query(
        "INSERT INTO reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        [user.user_id, tokenHash, tokenExpiry]
      );

      // Create reset link
      const resetUrl = `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/reset-password/${resetToken}`;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@yourapp.com",
        to: email,
        subject: "Password Reset Request",
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${user.username},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Your Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        status: "Success",
        message:
          "If your email is registered, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ Error: "Server error, please try again later." });
    }
  }
);

// Route: Reset Password
app.post(
  "/reset-password/:token",
  [
    check("password", "Password must be at least 10 characters").isLength({
      min: 10,
    }),
    check(
      "password",
      "Password must contain uppercase, lowercase, number, and special character"
    ).matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Error: errors.array()[0].msg });
    }

    const { password } = req.body;
    const resetToken = req.params.token;

    try {
      const tokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const tokenResult = await connection.query(
        "SELECT user_id FROM reset_tokens WHERE token = $1 AND expires_at > $2",
        [tokenHash, new Date()]
      );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ Error: "Invalid or expired token." });
      }

      const userId = tokenResult.rows[0].user_id;

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user's password
      await connection.query(
        "UPDATE users SET password = $1 WHERE user_id = $2",
        [hashedPassword, userId]
      );

      // Remove token after use
      await connection.query("DELETE FROM reset_tokens WHERE user_id = $1", [
        userId,
      ]);

      res.status(200).json({
        status: "Success",
        message: "Password reset successful.",
      });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ Error: "Server error, please try again later." });
    }
  }
);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
