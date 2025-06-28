const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.getAllInformationsAdmin = async (req, res) => {
  const ADMIN_DASHBOARD_QUERY = `
    WITH 
    total_users_cte AS (
        SELECT COUNT(*) AS total_users
        FROM users
        WHERE user_role != 'admin'
    ),
    total_courses_cte AS (
        SELECT COUNT(*) AS total_courses
        FROM courses
    ),
    total_communities_cte AS (
        SELECT COUNT(*) AS total_communities
        FROM communities
    ),
    total_blogs_cte AS (
        SELECT COUNT(*) AS total_blogs
        FROM blogs
    ),
    course_completion_percentage_cte AS (
        SELECT 
            ROUND(
                100.0 * (
                    SELECT COUNT(*) 
                    FROM (
                        SELECT DISTINCT user_id, material_id 
                        FROM completed_material
                    ) AS unique_completions
                ) /
                NULLIF((
                    SELECT COUNT(*) 
                    FROM course_participants cp
                    JOIN course_material cm ON cp.course_id = cm.course_id
                ), 0),
                2
            ) AS completion_percentage
    ),
    top_enrolled_courses_cte AS (
        SELECT STRING_AGG(course_info, ', ') AS top_5_courses
        FROM (
            SELECT c.name || ' (' || COUNT(cp.user_id) || ')' AS course_info
            FROM courses c
            JOIN course_participants cp ON c.course_id = cp.course_id
            GROUP BY c.course_id
            ORDER BY COUNT(cp.user_id) DESC
            LIMIT 5
        ) AS top_courses
    ),
    user_distribution_cte AS (
        SELECT 
            JSON_OBJECT_AGG(
                user_class_level,
                ROUND(100.0 * class_level_count::numeric / total_count, 2)
            ) AS class_level_distribution
        FROM (
            SELECT 
                user_class_level,
                COUNT(*) AS class_level_count
            FROM users
            WHERE user_role != 'admin'
            GROUP BY user_class_level
        ) sub,
        (
            SELECT COUNT(*) AS total_count
            FROM users
            WHERE user_role != 'admin'
        ) total
    )
    SELECT
        tu.total_users,
        tc.total_courses,
        tcom.total_communities,
        tb.total_blogs,
        ccp.completion_percentage AS course_completion_percentage,
        tec.top_5_courses,
        ud.class_level_distribution AS user_class_level_percentage
    FROM total_users_cte tu
    JOIN total_courses_cte tc ON TRUE
    JOIN total_communities_cte tcom ON TRUE
    JOIN total_blogs_cte tb ON TRUE
    JOIN course_completion_percentage_cte ccp ON TRUE
    JOIN top_enrolled_courses_cte tec ON TRUE
    JOIN user_distribution_cte ud ON TRUE;
`;

  try {
    const { rows } = await connection.query(ADMIN_DASHBOARD_QUERY);
    res.json(rows[0]);
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to load admin dashboard" });
  }
};
