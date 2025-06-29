const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const {
  compressImage,
  compressPDF,
  compressAudio,
  compressVideo,
} = require("../utils/MediaCompresser");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /image\/|audio\/|video\/|application\/pdf/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: Only images, audio, video, and PDF files are allowed!"
        )
      );
    }
  },
});

exports.getCourses = async (req, res) => {
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
        (
          SELECT COUNT(*) 
          FROM course_material cm 
          WHERE cm.course_id = c.course_id
        ) AS total_material,
        CASE 
          WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/courses/image/', c.course_id)
          ELSE NULL
        END AS cover_image_url,

        u.full_name AS instructor_name,

        CASE
          WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
          ELSE NULL
        END AS instructor_picture_url,

        COUNT(cp_all.user_id) AS total_student,

        BOOL_OR(cp_user.user_id IS NOT NULL) AS is_joined

      FROM courses c
      JOIN users u ON c.instructor_id = u.user_id

      LEFT JOIN course_participants cp_all 
        ON cp_all.course_id = c.course_id

      LEFT JOIN course_participants cp_user 
        ON cp_user.course_id = c.course_id AND cp_user.user_id = $1

      GROUP BY 
        c.course_id, c.name, c.description, c.created_at, c.subject, c.class_level, 
        c.cover_image, u.full_name, u.user_picture, u.user_id;`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    throw error;
    res.status(500).json({ error: error });
  }
};
exports.getEnrolledCourses = async (req, res) => {
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
        (
          SELECT COUNT(*) 
          FROM course_material cm 
          WHERE cm.course_id = c.course_id
        ) AS total_material,
        CASE 
          WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/courses/image/', c.course_id)
          ELSE NULL
        END AS cover_image_url,
        (
          SELECT 
            CASE 
              WHEN COUNT(*) = 0 THEN 0
              ELSE ROUND(
          100.0 * (
            SELECT COUNT(*) 
            FROM completed_material cmpl 
            JOIN course_material cmat ON cmpl.material_id = cmat.material_id 
            WHERE cmpl.user_id = $1 AND cmat.course_id = c.course_id
          )::numeric / COUNT(*), 2
              )
            END
          FROM course_material cm 
          WHERE cm.course_id = c.course_id
        ) AS completed,
        u.full_name AS instructor_name,

        CASE
          WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
          ELSE NULL
        END AS instructor_picture_url,

        COUNT(cp_all.user_id) AS total_student

      FROM courses c
      JOIN users u ON c.instructor_id = u.user_id

      -- Count all participants for total_student
      LEFT JOIN course_participants cp_all ON cp_all.course_id = c.course_id

      -- Inner join only those courses where user is enrolled
      JOIN course_participants cp_user ON cp_user.course_id = c.course_id AND cp_user.user_id = $1

      GROUP BY 
        c.course_id, c.name, c.description, c.created_at, c.subject, c.class_level, 
        c.cover_image, u.full_name, u.user_picture, u.user_id
      ;`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    throw error;
    res.status(500).json({ error: error });
  }
};

exports.getSingleCourse = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const { rows } = await connection.query(
      `SELECT 
          c.course_id,
          c.price, 
          c.name, 
          c.description, 
          c.created_at, 
          c.subject, 
          c.class_level,
        (
          SELECT COUNT(*) 
          FROM course_material cm 
          WHERE cm.course_id = c.course_id
        ) AS total_material,
          CASE 
            WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/courses/image/', c.course_id)
            ELSE NULL
          END AS cover_image_url,
          
          u.full_name AS instructor_name,
          
          CASE
            WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
            ELSE NULL
          END AS instructor_picture_url,
          
          COUNT(DISTINCT cp_all.user_id) AS total_student,
          
          BOOL_OR(cp_user.user_id IS NOT NULL) AS is_joined,
          
          -- Course materials as JSON array
          (
            SELECT COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'material_id', cm.material_id,
                  'name', cm.name,
                  'type', cm.material_type,
                  'is_completed', EXISTS (
            SELECT 1 FROM completed_material 
            WHERE completed_material.material_id = cm.material_id 
              AND completed_material.user_id = $1
            ),
                  'url', CONCAT('http://localhost:8000/courses/courseMaterial/', cm.material_id)
                )
              ),
              '[]'::json
            )
            FROM course_material cm
            WHERE cm.course_id = c.course_id
          ) AS course_materials
          
        FROM courses c
        JOIN users u ON c.instructor_id = u.user_id

        LEFT JOIN course_participants cp_all 
          ON cp_all.course_id = c.course_id

        LEFT JOIN course_participants cp_user 
          ON cp_user.course_id = c.course_id AND cp_user.user_id = $1

        WHERE c.course_id = $2

        GROUP BY 
          c.course_id, u.user_id;
      `,
      [userId, courseId]
    );

    res.json(rows[0]);
  } catch (error) {
    throw error;
    res.status(500).json({ error: error });
  }
};

// exports.getMyBlogs = async (req, res) => {
//   const userId = req.userId;

//   try {
//     const { rows } = await connection.query(
//       `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count,
//       CASE
//       WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
//       ELSE NULL
//       END AS cover_image_url,
//       u.full_name AS author_name,
//       CASE
//       WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
//       ELSE NULL
//       END AS author_picture_url,
//       COALESCE(bv.vote, 0) AS is_voted,
//       COALESCE(v_c.total_vote, 0) AS vote_count
//       FROM blogs b
//       JOIN users u ON b.author_id = u.user_id
//       LEFT JOIN blog_votes bv
//       ON bv.blog_id = b.blog_id AND bv.voter_id = $1
//       LEFT JOIN (
//         SELECT blog_id, SUM(vote) AS total_vote
//         FROM blog_votes
//         GROUP BY blog_id
//       ) v_c ON v_c.blog_id = b.blog_id
//       WHERE b.author_id = $2;
//       `,
//       [userId, userId]
//     );

//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };

// exports.getSingleBlog = async (req, res) => {
//   const { blogId } = req.params;
//   const userId = req.userId;

//   try {
//     const { rows } = await connection.query(
//       `SELECT b.blog_id, b.title, b.content, b.created_at, b.subject, b.class_level, b.view_count,
//       CASE
//       WHEN b.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/blogs/image/', b.blog_id)
//       ELSE NULL
//       END AS cover_image_url,
//       u.full_name AS author_name,
//       CASE
//       WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
//       ELSE NULL
//       END AS author_picture_url,
//       COALESCE(bv.vote, 0) AS is_voted,
//       COALESCE(v_c.total_vote, 0) AS vote_count
//       FROM blogs b
//       JOIN users u ON b.author_id = u.user_id
//       LEFT JOIN blog_votes bv
//       ON bv.blog_id = b.blog_id AND bv.voter_id = $1
//       LEFT JOIN (
//         SELECT blog_id, SUM(vote) AS total_vote
//         FROM blog_votes
//         GROUP BY blog_id
//       ) v_c ON v_c.blog_id = b.blog_id
//        WHERE b.blog_id = $2;
//       `,
//       [userId, blogId]
//     );

//     if (!rows.length) return res.status(404).json({ status: "404" });

//     res.json(rows[0]);
//   } catch (error) {
//     throw error;
//     res.status(500).json({ error: error });
//   }
// };

// // Configure multer for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

// exports.addBlog = [
//   upload.single("coverImage"), // Middleware to handle file upload
//   async (req, res) => {
//     const userId = req.userId;

//     const { title, content, classLevel, subject } = req.body;

//     const coverImageBuffer = req.file ? req.file.buffer : null; // Get binary buffer

//     try {
//       connection.query(
//         `INSERT INTO blogs (title, class_level, subject, content, cover_image, author_id)
//         VALUES ($1, $2, $3, $4, $5, $6)`,
//         [
//           title,
//           classLevel || null,
//           subject || null,
//           content,
//           coverImageBuffer || null,
//           userId,
//         ],
//         (err, results) => {
//           if (err) {
//             return res.status(500).json({ error: err });
//           }
//           return res.json({ status: "Success" });
//         }
//       );
//     } catch (error) {
//       res.status(500).json({ error: error });
//     }
//   },
// ];

exports.image = async (req, res) => {
  const { courseId } = req.params;

  try {
    connection.query(
      `SELECT cover_image FROM courses WHERE course_id = $1`,
      [courseId],
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

exports.searchCourses = async (req, res) => {
  const userId = req.userId;
  const { keyword } = req.params;

  console.log(keyword);

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

  COUNT(cp_all.user_id) AS total_student,

  BOOL_OR(cp_user.user_id IS NOT NULL) AS is_joined

FROM courses c
JOIN users u ON c.instructor_id = u.user_id

LEFT JOIN course_participants cp_all 
  ON cp_all.course_id = c.course_id

LEFT JOIN course_participants cp_user 
  ON cp_user.course_id = c.course_id AND cp_user.user_id = $1

WHERE c.name ILIKE $2 OR c.description ILIKE $2

GROUP BY 
  c.course_id, c.name, c.description, c.created_at, c.subject, c.class_level, 
  c.cover_image, u.full_name, u.user_picture, u.user_id

  LIMIT 3;`,
      [userId, `%${keyword}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.addMaterial = async (req, res) => {
  console.log("Adding course material...");
  // Use multer to handle file upload
  upload.array("files", 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        message: err.message,
      });
    }

    try {
      // Check if courseId is provided
      if (!req.body.courseId) {
        return res.status(400).json({
          status: "Error",
          message: "Course ID is required",
        });
      }

      const { courseId, materialName } = req.body;
      const materialFiles = req.files;

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      for (const file of materialFiles) {
        try {
          const materialType = getMaterialType(file.mimetype);
          let processedBuffer = file.buffer;

          // Apply compression based on file type
          switch (materialType) {
            case "image":
              processedBuffer = await compressImage(file);
              break;
            case "pdf":
              processedBuffer = await compressPDF(file);
              break;
            case "audio":
              processedBuffer = await compressAudio(file);
              break;
            case "video":
              processedBuffer = await compressVideo(file);
              break;
            default:
              // No compression for other types
              break;
          }

          await connection.query(
            `INSERT INTO course_material (course_id, material_type, material)
            VALUES ($1, $2, $3)`,
            [courseId, materialType, processedBuffer]
          );
        } catch (err) {
          console.error(`Failed to process ${file.originalname}:`, err.message);
          return res.status(500).json({
            status: "Error",
            message: `Failed to add material ${file.originalname}: ${err.message}`,
          });
        }
      }

      res.status(201).json({
        status: "Success",
        message: "Materials added successfully",
        data: {
          courseId,
          filesCount: materialFiles.length,
        },
      });
    } catch (error) {
      console.error("Error adding material:", error);
      res.status(500).json({
        status: "Error",
        message: "Internal server error",
      });
    } finally {
      // Clean up temp directory (optional)
      // This could be done more carefully in a production environment
      try {
        const files = await fs.promises.readdir(path.join(__dirname, "temp"));
        for (const file of files) {
          await unlink(path.join(__dirname, "temp", file));
        }
      } catch (cleanupError) {
        console.error("Temp cleanup error:", cleanupError);
      }
    }
  });
};

function getMaterialType(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (
    mime === "application/msword" ||
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "doc";
  if (
    mime === "application/vnd.ms-powerpoint" ||
    mime ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return "ppt";
  return "other";
}

function getMimeTypeFromMediaType(mediaType) {
  switch (mediaType) {
    case "image":
      return "image/jpeg";
    case "video":
      return "video/mp4";
    case "audio":
      return "audio/mpeg";
    case "document":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

exports.getCourseMaterial = async (req, res) => {
  const userId = req.userId;
  const { courseId, materialId } = req.params;

  console.log("Fetching course material for ID:", materialId);

  if (!materialId) {
    return res.status(400).json({ error: "Material ID is required" });
  }

  try {
    const result = await connection.query(
      `SELECT material, material_type, name FROM course_material WHERE material_id = $1`,
      [materialId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Course material not found" });
    }

    const { material, material_type, name } = result.rows[0];

    if (!material || !material_type) {
      return res.status(400).json({ error: "Invalid material data" });
    }

    const mimeType = getMimeTypeFromMediaType(material_type);

    // Set proper headers
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${name || "material"}"`
    );
    res.setHeader("Cache-Control", "public, max-age=31536000");

    res.send(material);
  } catch (error) {
    console.error("Error fetching course material:", error);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
  finally {
    try {
      await connection.query(
        `INSERT INTO completed_material(user_id, course_id, material_id)
       SELECT $1, $2, $3
       WHERE NOT EXISTS (
       SELECT 1 FROM completed_material WHERE user_id = $1 AND course_id = $2 AND material_id = $3
       );`,
        [userId, courseId, materialId]);
    }
    catch (error) {
      console.error("Error fetching course material:", error);
      res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
  }
};

exports.addCourse = [
  upload.single("coverImage"),
  async (req, res) => {
    const userId = req.userId;
    console.log("Adding new course...");

    const { name, description, classLevel, price, subject } = req.body;

    const coverImageBuffer = req.file ? req.file.buffer : null;

    try {
      connection.query(
        `INSERT INTO courses (name, description, class_level, price, subject, cover_image, instructor_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          name,
          description,
          classLevel || null,
          price || null,
          subject || null,
          coverImageBuffer || null,
          userId,
        ],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ error: err, message: "Internal Server Error" });
          }
          return res.json({ status: "Success" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error, message: "Internal Server Error" });
    }
  },
];



exports.material = async (req, res) => {
  const userId = req.userId;

  const { courseId, materialId } = req.params;

  try {
    connection.query(
      `SELECT material, material_type, name FROM course_material WHERE material_id = $1`,
      [materialId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!results.rows.length) {
          return res.status(404).json({ error: "Material not found" });
        }

        const { material, material_type, name } = results.rows[0];

        let contentType = "application/octet-stream";
        if (material_type === "image") contentType = "image/jpeg";
        else if (material_type === "video") contentType = "video/mp4";
        else if (material_type === "pdf") contentType = "application/pdf";

        res.setHeader("Content-Type", contentType);
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${name || "material"}"`
        );
        res.send(material);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
