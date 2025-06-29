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
              users.user_id, 
              users.full_name, 
              users.username, 
              users.user_class_level, 
              users.user_group, 
              users.user_department, 
              users.level, 
              COALESCE(SUM(ur.rating_point), 0) AS user_rating,
              CASE 
                WHEN users.user_picture IS NOT NULL 
                THEN CONCAT('http://localhost:8000/profile/image/', users.user_id)
                ELSE NULL 
              END AS user_picture
            FROM users 
            LEFT JOIN user_rating ur ON ur.user_id = users.user_id
            WHERE users.user_id = $1
            GROUP BY 
              users.user_id, users.full_name, users.username,
              users.user_class_level, users.user_group,
              users.user_department, users.level, users.user_picture
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
            'Battle Royale Champion' AS achievement_name,
            brr.ranks[ARRAY_POSITION(brr.user_ids, $1)] AS rank
          FROM battle_royale_result brr
          JOIN battles b ON brr.battle_id = b.battle_id
          WHERE $1 = ANY(brr.user_ids) 
            AND brr.ranks[ARRAY_POSITION(brr.user_ids, $1)] = 1

          UNION ALL

          SELECT 
            b.battle_id, 
            'Pair Battle Victor' AS achievement_name,
            1 AS rank
          FROM pair_to_pair_results ppr
          JOIN battles b ON ppr.battle_id = b.battle_id
          WHERE ppr.user_id = $1 AND ppr.win_status = 'win'

          ORDER BY rank 
          LIMIT 3
        ) t
      ),

      'login_streak', (
          SELECT row_to_json(t) FROM (
            WITH user_days AS (
              SELECT DISTINCT DATE(login_time) AS login_date
              FROM user_logins
              WHERE user_id = $1
                AND login_time >= CURRENT_DATE - INTERVAL '30 days'
            ),
            consecutive_groups AS (
              SELECT
                login_date,
                login_date - (ROW_NUMBER() OVER (ORDER BY login_date)) * INTERVAL '1 day' AS grp
              FROM user_days
            ),
            streak_group AS (
              SELECT 
                grp, 
                COUNT(*) AS streak_length, 
                MIN(login_date) AS start_date, 
                MAX(login_date) AS end_date
              FROM consecutive_groups
              GROUP BY grp
              ORDER BY end_date DESC
              LIMIT 1
            ),
            record_streak AS (
              SELECT MAX(streak_length) AS record_streak
              FROM (
                SELECT 
                  COUNT(*) AS streak_length
                FROM consecutive_groups
                GROUP BY grp
              ) AS all_streaks
            )
            SELECT 
              COALESCE(start_date, NULL) AS start_date,
              COALESCE(end_date, NULL) AS end_date,
              COALESCE(streak_length, 0) AS current_streak,
              COALESCE(record_streak, 0) AS record_streak
            FROM streak_group, record_streak
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
