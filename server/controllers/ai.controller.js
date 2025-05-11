const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyAcvGd01ictkG7QYrlKvTNsK0SfiZWoicI" })

exports.getMessages = async (req, res) => {
  const userId = req.userId;
  try {
    const { rows } = await connection.query(
      `SELECT * FROM ai_messages
      WHERE user_id = $1
      ORDER BY send_time DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getResponse = async (req, res) => {
  const userId = req.userId;

  const { message } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    connection.query(
      `INSERT INTO ai_messages (user_id, self, content)
      VALUES ($1, $2, $3)`,
      [userId, true, message],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        connection.query(
          `INSERT INTO ai_messages (user_id, self, content)
      VALUES ($1, $2, $3)`,
          [userId, false, response.text],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err });
            }
            return res.json({
              status: "Success",
              response: response.text
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
