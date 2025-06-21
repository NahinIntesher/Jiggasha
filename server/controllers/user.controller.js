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
