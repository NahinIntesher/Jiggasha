const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

exports.getBlogs = async (req, res) => {
  try {
    const { rows } = await connection.query(
      `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count, b.vote_count,
      CASE 
      WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url
      FROM blogs b
      JOIN users u ON b.author_id = u.user_id
      `,
      []
    );

    if (!rows.length) return res.status(404).json({ error: "No data found" });

    res.json(rows);
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

    console.log("User ID: ", userId);
    console.log("Cover image: ", title);
    try {
      connection.query(
        `INSERT INTO blogs (title, class_level, subject, content, cover_image, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [title, classLevel || null, subject || null, content, coverImageBuffer || null, userId],
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
    try {
      connection.query(
        `INSERT INTO blogs (title, class_level, subject, content, cover_image, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [title, classLevel || null, subject || null, content, coverImageBuffer || null, userId],
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


exports.image = async (req, res) => {
  const { blogId } = req.params;

  console.log("Blog ID: ", blogId);

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
        console.log("Image data: ", imageData);
        res.send(imageData);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};