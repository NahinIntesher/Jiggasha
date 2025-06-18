const connection = require("../config/database");

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT full_name, level, username, email, mobile_no, user_role, user_class_level, user_group, user_department, user_picture, user_rating 
       FROM users WHERE user_id = $1`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
