const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.allModelTests = async (req, res) => {
    const userId = req.userId;
    const { classLevel } = req.params;
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
                return res.status(500).json({ status: 'error', message: 'Database error' });
            }

            return res.status(200).json({
                status: 'success',
                data: results.rows
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
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
            mta.mark_obtained
            FROM model_test mt
            LEFT JOIN model_test_attempted mta
            ON mt.model_test_id = mta.model_test_id AND mta.user_id = $1
            WHERE mt.model_test_id = $2
            ORDER BY model_test_serial ASC;
        `;

        connection.query(query, [userId, modelTestId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ status: 'error', message: 'Database error' });
            }

            return res.status(200).json({
                status: 'success',
                data: results.rows[0]
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

