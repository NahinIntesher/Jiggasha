const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.allModelTests = async (req, res) => {
    const userId = req.userId;
    const { user_class_level } = req.params;
    // const user_class_level = '9-10';

    // Input validation
    // if (!user_class_level || !['9-10', '11-12'].includes(user_class_level)) {
    //     return res.status(400).json({ status: 'error', message: 'Invalid or missing class level' });
    // }

    try {
        const query = `
            SELECT * FROM model_test
            WHERE class_level = $1 
            ORDER BY model_test_serial ASC
        `;

        connection.query(query, [user_class_level], (err, results) => {
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

