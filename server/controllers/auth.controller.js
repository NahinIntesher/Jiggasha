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

  // Input validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({
      Error: "Missing required fields",
      required: ["name", "username", "email", "password"],
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ Error: "Invalid email format" });
  }

  // Password strength validation
  if (password.length < 6) {
    return res
      .status(400)
      .json({ Error: "Password must be at least 6 characters long" });
  }

  // Check for existing username or email
  connection.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [username, email],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ Error: "Database error" });
      }

      if (results.rows.length > 0) {
        const existingUser = results.rows[0];
        if (existingUser.username === username) {
          return res.status(400).json({ error: "Username already taken" });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ error: "Email already registered" });
        }
        if (existingUser.mobile_no === mobile) {
          return res
            .status(400)
            .json({ error: "Mobile number already registered" });
        }
      }

      // Hash password
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
                console.log("User registered successfully:", results);

                if (err.code === "23505") {
                  // Check which unique constraint failed
                  const detail = err.detail || "";
                  const constraint = err.constraint || "";

                  // Check by constraint name (most reliable)
                  if (constraint.includes("username")) {
                    return res.status(400).json({
                      error: "Username already exists",
                    });
                  }

                  if (constraint.includes("email")) {
                    return res.status(400).json({
                      error: "Email already registered",
                    });
                  }

                  if (constraint.includes("mobile_no")) {
                    return res.status(400).json({
                      error: "Mobile number already registered",
                    });
                  }

                  // Fallback: Check by error detail message
                  if (detail.includes("username")) {
                    return res.status(400).json({
                      error: "Username already exists",
                    });
                  }

                  if (detail.includes("email")) {
                    return res.status(400).json({
                      error: "Email already registered",
                    });
                  }

                  if (detail.includes("mobile_no")) {
                    return res.status(400).json({
                      error: "Mobile number already registered",
                    });
                  }

                  // Generic fallback
                  return res.status(400).json({
                    error: "Duplicate entry detected",
                  });
                }

                return res
                  .status(500)
                  .json({ Error: "Error registering user" });
              }
              return res.status(201).json({
                status: "Success",
                message: "User registered successfully",
              });
            }
          );
        })
        .catch((error) => {
          console.error("Password hashing error:", error);
          return res
            .status(500)
            .json({ Error: "Error processing registration" });
        });
    }
  );
};

exports.login = async (req, res) => {
  try {
    // Input validation
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "Failed",
        Error: "Username and password are required",
        field: "general",
      });
    }

    // Validate input format
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({
        status: "Failed",
        Error: "Invalid input format",
        field: "general",
      });
    }

    // Trim whitespace and validate length
    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) {
      return res.status(400).json({
        status: "Failed",
        Error: "Username cannot be empty",
        field: "username",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "Failed",
        Error: "Password must be at least 6 characters long",
        field: "password",
      });
    }

    // Database query with proper error handling
    const queryUser = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE username = $1",
          [trimmedUsername],
          (err, results) => {
            if (err) {
              console.error("Database query error:", err);
              reject({
                status: "Failed",
                Error: "Database connection error. Please try again later.",
                technical: err.message,
                field: "general",
              });
            } else {
              resolve(results);
            }
          }
        );
      });
    };

    // Execute database query
    let results;
    try {
      results = await queryUser();
    } catch (dbError) {
      return res.status(500).json(dbError);
    }

    // Check if user exists
    if (!results.rows || results.rows.length === 0) {
      return res.status(401).json({
        status: "Failed",
        Error: "Invalid username or password",
        field: "general",
      });
    }

    const user = results.rows[0];

    // Check if user account is active (if you have such field)
    if (user.status && user.status === "inactive") {
      return res.status(403).json({
        status: "Failed",
        Error: "Account is inactive. Please contact support.",
        field: "general",
      });
    }

    // Password comparison with proper error handling
    const comparePassword = () => {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error("Password comparison error:", err);
            reject({
              status: "Failed",
              Error: "Authentication error. Please try again.",
              technical: err.message,
              field: "general",
            });
          } else {
            resolve(isMatch);
          }
        });
      });
    };

    // Execute password comparison
    let isMatch;
    try {
      isMatch = await comparePassword();
    } catch (bcryptError) {
      return res.status(500).json(bcryptError);
    }

    // Check password match
    if (!isMatch) {
      return res.status(401).json({
        status: "Failed",
        Error: "Invalid username or password",
        field: "general",
      });
    }

    // ✅ LOGIN STREAK UPDATE
    await connection.query(
      `INSERT INTO user_logins (user_id, login_time)
      VALUES ($1, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET login_time = EXCLUDED.login_time`,
      [user.user_id]
    );

    // JWT token generation with error handling
    let token;
    try {
      const uid = user.user_id;

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured");
      }

      token = jwt.sign(
        {
          id: uid,
          username: user.username,
          role: user.user_role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
      );
    } catch (jwtError) {
      console.error("JWT generation error:", jwtError);
      return res.status(500).json({
        status: "Failed",
        Error: "Token generation failed. Please try again.",
        technical: jwtError.message,
        field: "general",
      });
    }

    // Cookie setting with comprehensive error handling
    try {
      if (!process.env.COOKIE_NAME) {
        throw new Error("COOKIE_NAME not configured");
      }

      const cookieOptions = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
      };

      // Validate cookie options
      if (cookieOptions.expires < new Date()) {
        throw new Error("Invalid cookie expiration time");
      }

      res.cookie(process.env.COOKIE_NAME, token, cookieOptions);

      // Success response with user data
      return res.status(200).json({
        status: "Success",
        message: "Login successful",
        token: token,
        cookieName: process.env.COOKIE_NAME,
        user: {
          id: user.user_id,
          username: user.username,
          name: user.user_full_name || user.username,
          role: user.user_role || "user",
          email: user.email || null,
        },
        loginTime: new Date().toISOString(),
      });
    } catch (cookieError) {
      console.error("Error setting cookie:", cookieError);
      return res.status(500).json({
        status: "Failed",
        Error: "Session creation failed. Please try again.",
        technical: cookieError.message,
        field: "general",
      });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Unexpected error in login function:", error);
    return res.status(500).json({
      status: "Failed",
      Error: "An unexpected error occurred. Please try again later.",
      technical:
        process.env.NODE_ENV === "development" ? error.message : undefined,
      field: "general",
    });
  }
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
