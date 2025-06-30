const connection = require("../config/database");
const multer = require("multer");

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT 
          u.user_id,
          u.full_name,
          u.level,
          u.username,
          u.email,
          u.mobile_no,
          u.user_role,
          u.user_class_level,
          u.user_group,
          u.user_department,
          COALESCE(CAST(ROUND(SUM(ur.rating_point)::numeric, 2) AS TEXT), '0.00') AS user_rating,
          CASE
            WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
            ELSE NULL
          END AS user_picture_url
      FROM 
          users u
      LEFT JOIN 
          user_rating ur ON u.user_id = ur.user_id
      WHERE 
          u.user_id = $1
      GROUP BY 
          u.user_id, u.full_name, u.level, u.username, u.email, u.mobile_no, 
          u.user_role, u.user_class_level, u.user_group, u.user_department, u.user_picture;`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (error) {
    // throw error; // Log the error for debugging
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
      WHERE
        u.user_role = 'student'
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
      WHERE
        u.user_role = 'student'
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
      WHERE
        u.user_role = 'student'
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

exports.getAllUsers = async (req, res) => {
  const query = `
      SELECT 
        u.user_id,
        u.full_name, 
        u.email, 
        u.user_class_level,
        u.user_group,
        u.user_department,
        u.mobile_no, 
        CASE 
            WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
            ELSE NULL
        END AS user_picture
    FROM users u 
    where u.user_role != 'admin'
    `;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed" });
    }

    return res.json({ users: result.rows });
  });
};

exports.deleteUser = (req, res) => {
  const deletedId = req.params.id;
  console.log("Deleting user with ID:", deletedId);
  let query = `DELETE FROM users WHERE user_id = $1`;

  connection.query(query, [deletedId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Failed to delete user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      status: "Success",
      message: "User deleted successfully",
    });
  });
};


exports.allCertifications = async (req, res) => {
  const userId = req.userId;

  const query = `
        SELECT *
          FROM (
            SELECT 
                c.course_id, 
                c.name, 
                c.description, 
                c.subject, 
                c.class_level,
                CASE 
                  WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/courses/image/', c.course_id)
                  ELSE NULL
                END AS cover_image_url,
                (
                  SELECT 
                    CASE 
                      WHEN COUNT(*) = 0 THEN 0
                      ELSE ROUND(
                        100.0 * (
                          SELECT COUNT(*) 
                          FROM completed_material cmpl 
                          JOIN course_material cmat ON cmpl.material_id = cmat.material_id 
                          WHERE cmpl.user_id = '7c786cfa-c729-4cdd-8db8-22bf54fc43a1' AND cmat.course_id = c.course_id
                        )::numeric / COUNT(*), 2
                      )
                    END
                  FROM course_material cm 
                  WHERE cm.course_id = c.course_id
                ) AS completed
              FROM courses c
              JOIN course_participants cp_user ON cp_user.course_id = c.course_id AND cp_user.user_id = '7c786cfa-c729-4cdd-8db8-22bf54fc43a1'
              GROUP BY 
                c.course_id 
          ) AS sub
      WHERE completed = 100.0;
    `;

  try {
    const result = await connection.query(query);
    res.json({ certifications: result.rows });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};