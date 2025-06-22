const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.getRecentCourses = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT 
          c.course_id,
          c.name,
          c.description,
          c.created_at,
          c.subject,
          c.class_level,

          CASE 
            WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/courses/image/', c.course_id)
            ELSE NULL
          END AS cover_image_url,

          u.full_name AS instructor_name,

          CASE
            WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
            ELSE NULL
          END AS instructor_picture_url,

          cp.accessed_at

      FROM course_participants cp
      JOIN courses c ON cp.course_id = c.course_id
      JOIN users u ON c.instructor_id = u.user_id

      WHERE cp.user_id = $1
        AND cp.accessed_at IS NOT NULL

      ORDER BY cp.accessed_at DESC
      LIMIT 3;

`,
          
      [userId]
    );

    res.json(rows);
  } catch (error) {
    // throw error;
    res.status(500).json({ error: error });
  }
};

exports.getRecentBattles = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        b.battle_id,
        b.title,
        b.topic,
        b.battle_type,
        b.start_time,
        b.end_time,
        bp.score,
        bp.rank
      FROM battle_participants bp
      JOIN battles b ON bp.battle_id = b.battle_id
      WHERE bp.participant_id = $1
        AND bp.rank IN (1, 2, 3)
      ORDER BY b.end_time DESC
      LIMIT 3;
    `;

    const { rows } = await connection.query(query, [userId]);

    return res.status(200).json({
      success: true,
      message: "Top 3 recent battles retrieved successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error in getRecentBattles:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recent battles",
    });
  }
};
