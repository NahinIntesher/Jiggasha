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
exports.getAllInformations = async (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT json_build_object(
      'profile', (
        SELECT row_to_json(t) FROM (
          SELECT 
            user_id, full_name, username, user_class_level, user_group, user_department, level,
            CASE 
              WHEN user_picture IS NOT NULL 
              THEN CONCAT('http://localhost:8000/profile/image/', user_id)
              ELSE NULL 
            END AS user_picture
          FROM users WHERE user_id = $1
        ) t
      ),

      'battle_stats', (
        SELECT row_to_json(t) FROM (
          SELECT 
            COUNT(*) AS total_battles,
            AVG(score) AS avg_score,
            AVG(rank) AS avg_rank,
            (
              SELECT COUNT(*) 
              FROM pair_to_pair_results 
              WHERE user_id = $1 AND win_status = 'win'
            ) AS pair_wins
          FROM battle_participants 
          WHERE participant_id = $1
        ) t
      ),

      'recent_classes', (
        SELECT json_agg(t) FROM (
          SELECT 
            cm.material_id,
            c.course_id,
            cm.name AS material_name, 
            c.name AS course_name, 
            c.subject, 
            cm.created_at
          FROM course_material cm
          JOIN courses c ON cm.course_id = c.course_id
          JOIN course_participants cp ON c.course_id = cp.course_id
          WHERE cp.user_id = $1
          ORDER BY cm.created_at DESC 
          LIMIT 5
        ) t
      ),

      'improvement_areas', (
        SELECT json_agg(t) FROM (
          SELECT 
            b.subject,
            COUNT(*) FILTER (WHERE NOT ua.is_correct) AS wrong_answers,
            (
              SELECT COUNT(*) 
              FROM battle_royale_result brr 
              WHERE $1 = ANY(brr.user_ids) 
                AND brr.ranks[ARRAY_POSITION(brr.user_ids, $1)] > 3
            ) AS low_rank_battles,
            (
              SELECT COUNT(*) 
              FROM pair_to_pair_results 
              WHERE user_id = $1 AND win_status = 'lose'
            ) AS lost_pair_battles
          FROM user_answers ua
          JOIN battle_questions bq ON ua.question_id = bq.battle_question_id
          JOIN battles b ON ua.battle_id = b.battle_id
          WHERE ua.user_id = $1
          GROUP BY b.subject
          ORDER BY wrong_answers DESC 
          LIMIT 3
        ) t
      ),

      'achievements', (
        SELECT json_agg(t) FROM (
          SELECT 
            b.battle_id, 
            b.title, 
            'Battle Royale Champion' AS achievement_name,
            brr.ranks[ARRAY_POSITION(brr.user_ids, $1)] AS rank
          FROM battle_royale_result brr
          JOIN battles b ON brr.battle_id = b.battle_id
          WHERE $1 = ANY(brr.user_ids) 
            AND brr.ranks[ARRAY_POSITION(brr.user_ids, $1)] = 1

          UNION ALL

          SELECT 
            b.battle_id, 
            b.title, 
            'Pair Battle Victor' AS achievement_name,
            1 AS rank
          FROM pair_to_pair_results ppr
          JOIN battles b ON ppr.battle_id = b.battle_id
          WHERE ppr.user_id = $1 AND ppr.win_status = 'win'

          ORDER BY rank 
          LIMIT 3
        ) t
      ),

      'battle_streak', (
        SELECT row_to_json(t) FROM (
          WITH streak_data AS (
            SELECT 
              COALESCE(us.current_streak, 0) AS current_streak,
              COALESCE(us.record_streak, 0) AS record_streak
            FROM users u
            LEFT JOIN user_streaks us ON u.user_id = us.user_id
            WHERE u.user_id = $1
          ),
          battle_days AS (
            SELECT DISTINCT DATE(bp.joined_at) AS battle_date
            FROM battle_participants bp
            WHERE bp.participant_id = $1
          ),
          streak_calc AS (
            SELECT 
              COUNT(*) AS calculated_streak
            FROM (
              SELECT 
                battle_date - ROW_NUMBER() OVER (ORDER BY battle_date DESC) * INTERVAL '1 day' AS grp
              FROM battle_days
              WHERE battle_date >= CURRENT_DATE - INTERVAL '30 days'
            ) t 
            GROUP BY grp 
            ORDER BY COUNT(*) DESC 
            LIMIT 1
          )
          SELECT 
            COALESCE((SELECT calculated_streak FROM streak_calc), 0) AS current_streak,
            (SELECT record_streak FROM streak_data) AS record_streak
        ) t
      )
    ) AS dashboard;

  `;

  try {
    const { rows } = await connection.query(query, [userId]);
    res.json(rows[0].dashboard);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};
