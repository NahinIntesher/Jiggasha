const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.allModelTests = async (req, res) => {
  const userId = req.userId;
  const { classLevel } = req.params;

  try {
    const query = `
            SELECT 
            mt.*, 
            COALESCE(mta.model_test_attempted_id IS NOT NULL, false) AS is_attempted,
            mta.mark_obtained
            FROM model_test mt
            LEFT JOIN model_test_attempted mta
            ON mt.model_test_id = mta.model_test_id AND mta.user_id = $1
            WHERE mt.class_level = $2 
            ORDER BY model_test_serial ASC;
        `;

    connection.query(query, [userId, classLevel], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      return res.status(200).json({
        status: "success",
        data: results.rows,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.singleModelTest = async (req, res) => {
  const userId = req.userId;
  const { modelTestId } = req.params;
  // const user_class_level = '9-10';

  // Input validation
  // if (!user_class_level || !['9-10', '11-12'].includes(user_class_level)) {
  //     return res.status(400).json({ status: 'error', message: 'Invalid or missing class level' });
  // }

  try {
    const query = `
        SELECT 
            mt.*,
            COALESCE(mta.model_test_attempted_id IS NOT NULL, false) AS is_attempted,
            mta.mark_obtained,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'question_id', q.question_id,
                        'content', q.content,
                        'option_a', q.option_a,
                        'option_b', q.option_b,
                        'option_c', q.option_c,
                        'option_d', q.option_d,
                        'correct_option', q.correct_option,
                        'topic', q.topic,
                        'difficulty', q.difficulty
                    )
                ) FILTER (WHERE q.question_id IS NOT NULL), 
                '[]'
            ) AS questions
        FROM model_test mt
        LEFT JOIN model_test_attempted mta
            ON mt.model_test_id = mta.model_test_id AND mta.user_id = $1
        LEFT JOIN LATERAL (
            SELECT *
            FROM questions
            WHERE class_level = mt.class_level
            AND subject = mt.subject
            ORDER BY RANDOM()
            LIMIT mt.total_questions
        ) q ON TRUE
        WHERE mt.model_test_id = $2
        GROUP BY mt.model_test_id, mta.model_test_attempted_id, mta.mark_obtained;
`;

    connection.query(query, [userId, modelTestId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      return res.status(200).json({
        status: "success",
        data: results.rows[0],
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.submitToModelTestAttempt = async (req, res) => {
  console.log("Submitting model test attempt");
  const userId = req.userId;
  const { model_test_id, mark_obtained, attempted_at, user_taken_time } =
    req.body;

  try {
    const query = `
            INSERT INTO model_test_attempted (user_id, model_test_id, mark_obtained, attempted_at, user_taken_time)
            VALUES ($1, $2, $3, $4, $5)
        `;

    connection.query(
      query,
      [userId, model_test_id, mark_obtained, attempted_at, user_taken_time],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ status: "error", message: "Database error" });
        }

        return res.status(200).json({
          status: "success",
          message: "Model test attempt submitted successfully",
        });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
