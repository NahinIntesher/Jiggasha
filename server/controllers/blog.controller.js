const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.getBlogs = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count,
      CASE 
      WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url,
      COALESCE(bv.vote, 0) AS is_voted,
      COALESCE(v_c.total_vote, 0) AS vote_count
      FROM blogs b
      JOIN users u ON b.author_id = u.user_id
      LEFT JOIN blog_votes bv 
      ON bv.blog_id = b.blog_id AND bv.voter_id = $1
      LEFT JOIN (
        SELECT blog_id, SUM(vote) AS total_vote
        FROM blog_votes
        GROUP BY blog_id
      ) v_c ON v_c.blog_id = b.blog_id;
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getMyBlogs = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count,
      CASE 
      WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url,
      COALESCE(bv.vote, 0) AS is_voted,
      COALESCE(v_c.total_vote, 0) AS vote_count
      FROM blogs b
      JOIN users u ON b.author_id = u.user_id
      LEFT JOIN blog_votes bv 
      ON bv.blog_id = b.blog_id AND bv.voter_id = $1
      LEFT JOIN (
        SELECT blog_id, SUM(vote) AS total_vote
        FROM blog_votes
        GROUP BY blog_id
      ) v_c ON v_c.blog_id = b.blog_id
      WHERE b.author_id = $2;
      `,
      [userId, userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count,
      CASE 
      WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url,
      COALESCE(bv.vote, 0) AS is_voted,
      COALESCE(v_c.total_vote, 0) AS vote_count
      FROM blogs b
      JOIN users u ON b.author_id = u.user_id
      LEFT JOIN blog_votes bv 
      ON bv.blog_id = b.blog_id AND bv.voter_id = $1
      LEFT JOIN (
        SELECT blog_id, SUM(vote) AS total_vote
        FROM blog_votes
        GROUP BY blog_id
      ) v_c ON v_c.blog_id = b.blog_id
       WHERE b.blog_id = $2;
      `,
      [userId, blogId]
    );

    if (!rows.length) return res.status(404).json({ status: "404" });

    res.json(rows[0]);
  } catch (error) {
    throw error;
    res.status(500).json({ error: error });
  }
};

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

exports.addBlog = [
  upload.single("coverImage"), // Middleware to handle file upload
  async (req, res) => {
    const userId = req.userId;

    const { title, content, classLevel, subject } = req.body;

    const coverImageBuffer = req.file ? req.file.buffer : null; // Get binary buffer

    try {
      connection.query(
        `INSERT INTO blogs (title, class_level, subject, content, cover_image, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          title,
          classLevel || null,
          subject || null,
          content,
          coverImageBuffer || null,
          userId,
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          return res.json({ status: "Success" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
];

exports.vote = async (req, res) => {
  const userId = req.userId;

  const { blogId, vote } = req.body;

  try {
    connection.query(
      `SELECT * FROM blog_votes WHERE blog_id = $1 AND voter_id = $2`,
      [blogId, userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        if (results.rows.length) {
          // User has already voted, update the vote
          connection.query(
            `UPDATE blog_votes SET vote = $1 WHERE blog_id = $2 AND voter_id = $3`,
            [vote, blogId, userId],
            (err, results) => {
              if (err) {
                return res.status(500).json({ error: err });
              }
              return res.json({ status: "Success" });
            }
          );
          return;
        } else {
          connection.query(
            `INSERT INTO blog_votes (blog_id, voter_id, vote)
          VALUES ($1, $2, $3)`,
            [blogId, userId, vote],
            (err, results) => {
              if (err) {
                return res.status(500).json({ error: err });
              }
              return res.json({ status: "Success" });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.unvote = async (req, res) => {
  const userId = req.userId;

  const { blogId } = req.body;

  try {
    connection.query(
      `DELETE FROM blog_votes
      WHERE voter_id = $1 AND blog_id = $2;`,
      [userId, blogId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return res.json({ status: "Success" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.image = async (req, res) => {
  const { blogId } = req.params;

  try {
    connection.query(
      `SELECT cover_image FROM blogs WHERE blog_id = $1`,
      [blogId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!results.rows.length) {
          return res.status(404).json({ error: "Image not found" });
        }

        const imageData = results.rows[0].cover_image;

        // Optional: detect mime type or assume JPEG
        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageData);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
