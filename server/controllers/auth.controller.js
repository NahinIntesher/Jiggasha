// No need for the router, it's defined in routes
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/database");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signup = (req, res) => {
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
};

exports.login = (req, res) => {
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

        const uid = user.user_id;
        const token = jwt.sign({ id: uid }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });

        // For Localhost
        // const cookieOptions = {
        //   expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "development",
        //   sameSite: "Lax",
        //   path: "/",
        // };

        // const isProd = process.env.NODE_ENV === "production";
        // For Production
        console.log("process.env.NODE_ENV: ");
        console.log(process.env.NODE_ENV);
        try {
          const cookieOptions = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
          };

          res.cookie(process.env.COOKIE_NAME, token, cookieOptions);

          console.log("Cookie set successfully");

          return res.status(200).json({
            status: "Success",
            cookieName: process.env.COOKIE_NAME,
            user: {
              id: user.user_id,
              name: user.user_full_name,
              role: user.user_role,
            },
          });
        } catch (error) {
          console.error("Error setting cookie:", error);
          return res.status(500).json({ status: "Failed", error: error });
        }
      });
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  return res.status(200).json({ status: "Success" });
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Error: errors.array()[0].msg });
  }

  const { email } = req.body;

  try {
    const userResult = await connection.query(
      "SELECT user_id, username FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(200).json({
        status: "Success",
        message:
          "If your email is registered, you will receive password reset instructions.",
      });
    }

    const user = userResult.rows[0];

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); 

    await connection.query("DELETE FROM reset_tokens WHERE user_id = $1", [
      user.user_id,
    ]);
    await connection.query(
      "INSERT INTO reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.user_id, tokenHash, tokenExpiry]
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || `"Jiggasha" <${process.env.EMAIL_USERNAME}>`,
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
};

exports.resetPassword = async (req, res) => {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",
      [hashedPassword, userId]
    );

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
};
