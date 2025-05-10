const connection = require("../config/database");

exports.getBlogs = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT * FROM blogs`,
      []
    );

    if (!rows.length) return res.status(404).json({ error: "No data found" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.addBlog = async (req, res) => {
  const userId = req.userId;

  const {
    title,
    content,
    classLevel,
    subject
  } = req.body;

  try {
    connection.query(
      `INSERT INTO blogs (title, class, subject, content, author_id)
      VALUES ($1, $2, $3, $4, $5)`,
      [
        title,
        classLevel || null,
        subject || null,
        content,
        userId
      ],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: err });
        }
        return res.json({ status: "Success" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

