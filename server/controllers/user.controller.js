const connection = require("../config/database");
const multer = require("multer");

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT full_name, level, username, email, mobile_no, user_role, user_class_level, user_group, user_department, user_rating,
      CASE
      WHEN user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', user_id)
      ELSE NULL
      END AS user_picture_url
       FROM users WHERE user_id = $1`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (error) {
    throw error; // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};


exports.image = async (req, res) => {
  const { userId } = req.params;

  try {
    connection.query(
      `SELECT user_picture FROM users WHERE user_id = $1`,
      [userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!results.rows.length) {
          return res.status(404).json({ error: "Image not found" });
        }

        const imageData = results.rows[0].user_picture;

        // Optional: detect mime type or assume JPEG
        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageData);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaderboard = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT full_name, username, level, user_rating,
      CASE
        WHEN user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', user_id)
        ELSE NULL
      END AS user_picture_url 
      FROM users
      ORDER BY user_rating DESC;`,
      []
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTimeLeaderboard = async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT 
        u.full_name,
        u.username,
        u.level,
        COALESCE(ROUND(SUM(ur.rating_point)::numeric, 2), 0) AS total_rating,
        COUNT(ur.rating_id) AS rating_count,

      CASE
        WHEN user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
        ELSE NULL
      END AS user_picture_url 

      FROM 
        users u
      LEFT JOIN 
        user_rating ur ON u.user_id = ur.user_id
      GROUP BY 
        u.user_id, u.username
      ORDER BY 
        total_rating DESC
      LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT 
        u.full_name,
        u.username,
        u.level,
        COALESCE(ROUND(SUM(ur.rating_point)::numeric, 2), 0) AS weekly_rating,
        COUNT(ur.rating_id) AS rating_count,

      CASE
        WHEN user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
        ELSE NULL
      END AS user_picture_url 
      
      FROM 
        users u
      LEFT JOIN 
        user_rating ur ON u.user_id = ur.user_id
        AND ur.earned_at >= (NOW() - INTERVAL '7 days')
      GROUP BY 
        u.user_id, u.username
      ORDER BY 
        weekly_rating DESC
      LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT 
        u.full_name,
        u.username,
        u.level,
        COALESCE(ROUND(SUM(ur.rating_point)::numeric, 2), 0) AS monthly_rating,
        COUNT(ur.rating_id) AS rating_count,

      CASE
        WHEN user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
        ELSE NULL
      END AS user_picture_url 
      
      FROM 
        users u
      LEFT JOIN 
        user_rating ur ON u.user_id = ur.user_id
        AND ur.earned_at >= (NOW() - INTERVAL '30 days')
      GROUP BY 
        u.user_id, u.username
      ORDER BY 
        monthly_rating DESC
      LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const upload = multer({ storage: multer.memoryStorage() });

exports.updateProfilePicture = [
  upload.single("profilePicture"), // Middleware to handle file upload
  async (req, res) => {
    const userId = req.userId;
    const profilePictureBuffer = req.file ? req.file.buffer : null; // Get binary buffer

    if (!profilePictureBuffer) {
      return res.status(400).json({ error: "No profile picture uploaded" });
    }

    try {
      const result = await connection.query(
        `UPDATE users SET user_picture = $1 WHERE user_id = $2`,
        [profilePictureBuffer, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ status: "Success" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
];

exports.changeProfileDetails = async (req, res) => {
  const userId = req.userId;
  const { name, email, mobile_no, classLevel, group, department } = req.body;

  try {
    const result = await connection.query(
      `UPDATE users SET full_name = $1 WHERE user_id = $2`,
      [name, userId]
    );

    res.json({ status: "Success" });
  } catch (error) {
    console.error("Error updating profile details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
