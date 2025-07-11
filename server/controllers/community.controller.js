const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Configure multer for file uploads
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

exports.getCommunities = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT 
          c.community_id, 
          c.name, 
          c.description, 
          c.created_at, 
          c.subject, 
          c.class_level, 
          c.approval_status, 
          c.admin_id,
          c.created_at AS created_at,
          u.full_name AS admin_name,
          CASE 
              WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', u.user_id)
              ELSE NULL
          END AS admin_picture,

          CASE 
              WHEN c.cover_image IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/communities/image/', c.community_id)
              ELSE NULL
          END AS cover_image_url,

          CASE 
              WHEN cm.membership_id IS NOT NULL THEN 1
              ELSE 0
          END AS is_member,

          COALESCE(member_count.total_members, 0) AS total_members

      FROM communities c

      LEFT JOIN users u 
          ON c.admin_id = u.user_id

      LEFT JOIN community_members cm 
          ON c.community_id = cm.community_id 
          AND cm.member_id = $1

      LEFT JOIN (
          SELECT community_id, COUNT(*) AS total_members
          FROM community_members
          GROUP BY community_id
      ) AS member_count
          ON c.community_id = member_count.community_id;`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getMyCommunities = async (req, res) => {
  const userId = req.userId;
  try {
    const { rows } = await connection.query(
      `SELECT
        c.community_id,
        c.name,
        c.description,
        c.created_at,
        c.subject,
        c.class_level,
        c.approval_status,
        c.admin_id,
        u.full_name AS admin_name,
          CASE 
              WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/users/profile/', u.user_picture)
              ELSE NULL
          END AS admin_picture,
        CASE
          WHEN c.cover_image IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/communities/image/', c.community_id)
          ELSE NULL
        END AS cover_image_url,
        CASE
          WHEN cm.membership_id IS NOT NULL THEN 1
          ELSE 0
        END AS is_member,
        COALESCE(member_count.total_members, 0) AS total_members
      FROM communities c
      LEFT JOIN users u 
          ON c.admin_id = u.user_id
      LEFT JOIN community_members cm
        ON c.community_id = cm.community_id
        AND cm.member_id = $1
      LEFT JOIN (
        SELECT community_id, COUNT(*) AS total_members
        FROM community_members
        GROUP BY community_id
      ) AS member_count
        ON c.community_id = member_count.community_id
      WHERE c.admin_id = $1;`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getSingleCommunities = async (req, res) => {
  const { communityId } = req.params;
  const userId = req.userId;

  try {
    const { rows } = await connection.query(
      `SELECT
          c.community_id,
          c.name,
          c.description,
          c.created_at,
          c.subject,
          c.class_level,
          c.admin_id,
          
          -- Admin Info
          u.full_name AS admin_name,
          u.username AS username,
          CASE 
            WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', u.user_id)
            ELSE NULL
          END AS admin_picture,

          -- Cover Image
          CASE 
            WHEN c.cover_image IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/communities/image/', c.community_id)
            ELSE NULL
          END AS cover_image_url,

          -- Total Members
          COALESCE(mc.total_members, 0) AS total_members,

          -- Current User Info
          cu.full_name AS current_user_name,
          cu.username AS current_user_username,
          CASE 
            WHEN cu.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', cu.user_id)
            ELSE NULL
          END AS current_user_picture

        FROM communities c

        -- Admin Info Join
        LEFT JOIN users u
          ON c.admin_id = u.user_id

        -- Member Count Subquery
        LEFT JOIN (
          SELECT community_id, COUNT(*) AS total_members
          FROM community_members
          GROUP BY community_id
        ) mc ON c.community_id = mc.community_id

        -- Current User Info Join
        LEFT JOIN users cu
          ON cu.user_id = $2

        WHERE c.community_id = $1;

      `,
      [communityId, userId]
    );

    if (!rows.length) return res.status(404).json({ status: "404" });

    res.json(rows[0]);
  } catch (error) {
    throw error;
    res.status(500).json({ error: error });
  }
};

exports.addCommunity = [
  upload.single("coverImage"),
  async (req, res) => {
    const userId = req.userId;

    const { name, description, classLevel, subject } = req.body;

    const coverImageBuffer = req.file ? req.file.buffer : null;

    try {
      connection.query(
        `INSERT INTO communities (name, description, class_level, subject, cover_image, admin_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          name,
          description,
          classLevel || null,
          subject || null,
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

exports.image = async (req, res) => {
  const { communityId } = req.params;

  try {
    connection.query(
      `SELECT cover_image FROM communities WHERE community_id = $1`,
      [communityId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!results.rows.length) {
          return res.status(404).json({ error: "Image not found" });
        }

        const imageData = results.rows[0].cover_image;

        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageData);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinCommunity = async (req, res) => {
  const userId = req.userId;
  const communityId = req.body.community_id;
  if (!communityId || !userId) {
    return res.status(400).json({
      success: false,
      error: "Community ID and User ID are required",
    });
  }

  try {
    // Insert new membership
    await connection.query(
      `INSERT INTO community_members (member_id, community_id, role, joined_at) VALUES ($1, $2, $3, NOW())`,
      [userId, communityId, "member"]
    );

    // Optional: Get updated member count
    const { rows: memberCount } = await connection.query(
      `SELECT COUNT(*) as total_members FROM community_members WHERE community_id = $1`,
      [communityId]
    );

    res.status(200).json({
      success: true,
      message: "Joined community successfully",
      data: {
        communityId: communityId,
        totalMembers: parseInt(memberCount[0].total_members),
      },
    });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.getAllPosts = async (req, res) => {
  const { communityId } = req.params;
  const userId = req.userId;

  if (!communityId) {
    return res.status(400).json({ error: "Community ID is required" });
  }

  try {
    const result = await connection.query(
      `
      SELECT
        p.post_id,
        p.content,
        p.member_id,
        p.created_at,
        p.updated_at,
        
        -- Reactions count
        COALESCE(r.reaction_count, 0) AS reaction_count,

        CASE
          WHEN EXISTS (
            SELECT *
            FROM community_post_reactions
            WHERE community_post_reactions.post_id = p.post_id 
            AND community_post_reactions.reactor_id = $1
          ) THEN 1
          ELSE 0
        END AS is_reacted,
        
        -- Comments count
        COALESCE(c.comment_count, 0) AS comment_count,
        
        -- Media array with URLs
        COALESCE(m.media, '[]') AS media,
        
        -- Poster (Admin/User) information
        u.full_name AS author_name,
        CASE
          WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', u.user_id)
          ELSE NULL
        END AS author_picture

      FROM community_posts p

      -- Join reactions count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS reaction_count
        FROM community_post_reactions
        GROUP BY post_id
      ) r ON p.post_id = r.post_id
      
      -- Join comments count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM community_post_comments
        GROUP BY post_id
      ) c ON p.post_id = c.post_id
       
      -- Join media with updated URL pattern
      LEFT JOIN (
        SELECT
          post_id,
          JSON_AGG(JSON_BUILD_OBJECT(
            'media_id', media_id,
            'media_type', media_type,
            'media_url', CONCAT('https://jiggasha.onrender.com/communities/postMedia/', media_id),
            'created_at', created_at
          ) ORDER BY created_at) AS media
        FROM community_post_media
        WHERE media_blob IS NOT NULL
        GROUP BY post_id
      ) m ON p.post_id = m.post_id

      -- Join user table
      LEFT JOIN users u ON p.member_id = u.user_id

      WHERE p.community_id = $2
      ORDER BY p.created_at DESC;
      `,
      [userId, communityId]
    );

    res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSinglePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const result = await connection.query(
      `
      SELECT
        p.post_id,
        p.content,
        p.member_id,
        p.created_at,
        p.updated_at,
        
        -- Reactions count
        COALESCE(r.reaction_count, 0) AS reaction_count,
        
        -- Comments count
        COALESCE(c.comment_count, 0) AS comment_count,

        CASE
          WHEN EXISTS (
            SELECT *
            FROM community_post_reactions
            WHERE community_post_reactions.post_id = p.post_id 
            AND community_post_reactions.reactor_id = $1
          ) THEN 1
          ELSE 0
        END AS is_reacted,
        
        -- Media array with URLs
        COALESCE(m.media, '[]') AS media,
        
        -- Poster (Admin/User) information
        u.full_name AS author_name,
        CASE
          WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', u.user_id)
          ELSE NULL
        END AS author_picture,

        -- Commentators information
        (
          SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'full_name', uc.full_name,
            'commentator_name', uc.username,
            'user_picture', CASE
              WHEN uc.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', uc.user_id)
              ELSE NULL
            END,
            'comment', cc.content,
            'commented_at', cc.commented_at
          ) ORDER BY cc.commented_at DESC)
          FROM community_post_comments cc
          JOIN users uc ON cc.commentator_id = uc.user_id
          WHERE cc.post_id = p.post_id
        ) AS commentators,

        -- Reactors information
        (
          SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'full_name', ur.full_name,
            'reactor_name', ur.username,
            'user_picture', CASE
              WHEN ur.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', ur.user_id)
              ELSE NULL
            END,
            'reacted_at', cr.reacted_at
          ) ORDER BY cr.reacted_at DESC)
          FROM community_post_reactions cr
          JOIN users ur ON cr.reactor_id = ur.user_id
          WHERE cr.post_id = p.post_id
        ) AS reactors

      FROM community_posts p

      -- Join reactions count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS reaction_count
        FROM community_post_reactions
        GROUP BY post_id
      ) r ON p.post_id = r.post_id

      -- Join comments count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM community_post_comments
        GROUP BY post_id
      ) c ON p.post_id = c.post_id
      
      -- Join media with updated URL pattern
      LEFT JOIN (
        SELECT
          post_id,
          JSON_AGG(JSON_BUILD_OBJECT(
            'media_id', media_id,
            'media_type', media_type,
            'media_url', CONCAT('https://jiggasha.onrender.com/communities/postMedia/', media_id),
            'created_at', created_at
          ) ORDER BY created_at) AS media
        FROM community_post_media
        WHERE media_blob IS NOT NULL
        GROUP BY post_id
      ) m ON p.post_id = m.post_id

      -- Join user table
      LEFT JOIN users u ON p.member_id = u.user_id

      WHERE p.post_id = $2
      `,
      [userId, postId]
    );

    res.status(200).json({ post: result.rows[0] });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createPost = async (req, res) => {
  upload.array("media", 5)(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res
        .status(400)
        .json({ error: "File upload failed: " + err.message });
    }

    const { community_id, content } = req.body;
    const userId = req.userId;
    const uploadedFiles = req.files || [];

    try {
      await connection.query("BEGIN");

      const postResult = await connection.query(
        `INSERT INTO community_posts (
          community_id,
          member_id,
          content,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING post_id`,
        [community_id, userId, content]
      );

      const postId = postResult.rows[0].post_id;

      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const mediaType = getMediaType(file.mimetype);
          let bufferToStore = file.buffer;

          if (mediaType === "image") {
            try {
              bufferToStore = await sharp(file.buffer)
                .resize({ width: 1280 })
                .jpeg({ quality: 70 })
                .toBuffer();
            } catch (imgErr) {
              console.warn("Image compression failed:", imgErr.message);
            }
          }

          await connection.query(
            `INSERT INTO community_post_media (post_id, media_type, media_blob, created_at)
             VALUES ($1, $2, $3, NOW())`,
            [postId, mediaType, bufferToStore]
          );
        }
      }

      await connection.query("COMMIT");

      res.status(201).json({
        message: "Post created successfully",
        post_id: postId,
        media_count: uploadedFiles.length,
      });
    } catch (error) {
      await connection.query("ROLLBACK");
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  });
};

exports.postMedia = async (req, res) => {
  const { mediaId } = req.params;

  if (!mediaId) {
    return res.status(400).json({ error: "Media ID is required" });
  }

  try {
    const result = await connection.query(
      `SELECT media_blob, media_type FROM community_post_media WHERE media_id = $1`,
      [mediaId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Media not found" });
    }

    const { media_blob, media_type } = result.rows[0];

    if (!media_blob || !media_type) {
      return res.status(400).json({ error: "Invalid media data" });
    }

    const mimeType = getMimeTypeFromMediaType(media_type);

    // Set proper headers
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "public, max-age=31536000");

    res.send(media_blob);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

function getMediaType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype === "application/pdf" || mimetype.includes("document"))
    return "document";
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

exports.postReaction = async function (req, res) {
  const userId = req.userId;
  const { postId } = req.body;

  connection.query(
    `SELECT * FROM community_post_reactions WHERE post_id = $1 AND reactor_id = $2`,
    [postId, userId],
    function (error, result) {
      if (error) {
        console.error("Error fetching reaction:", error);
        return res
          .status(500)
          .json({ status: "Error", message: "Server error" });
      }

      if (result.rows.length === 0) {
        connection.query(
          `INSERT INTO community_post_reactions (post_id, reactor_id) VALUES ($1, $2)`,
          [postId, userId],
          function (error, result) {
            if (error) {
              console.error("Error inserting reaction:", error);
              return res
                .status(500)
                .json({ status: "Error", message: "Server error" });
            }

            return res.json({ status: "Success", message: "Liked" });
          }
        );
      } else {
        connection.query(
          `DELETE FROM community_post_reactions WHERE post_id = $1 AND reactor_id = $2`,
          [postId, userId],
          function (error, result) {
            if (error) {
              console.error("Error deleting reaction:", error);
              return res
                .status(500)
                .json({ status: "Error", message: "Server error" });
            }

            return res.json({ status: "Success", message: "Unliked" });
          }
        );
      }
    }
  );
};

exports.postComment = async function (req, res) {
  const userId = req.userId;
  const { postId, commentContent } = req.body;
  console.log(postId, commentContent, userId);

  try {
    connection.query(
      `INSERT INTO community_post_comments (content, post_id, commentator_id)
       VALUES ($1, $2, $3)`,
      [commentContent, postId, userId],
      (err, results) => {
        if (err) {
          console.error("Insert error:", err);
          return res
            .status(500)
            .json({ status: "Error", Error: "Failed to save comment" });
        }

        return res.json({ status: "Success" });
      }
    );
  } catch (err) {
    console.error("Unhandled exception:", err);
    return res
      .status(500)
      .json({ status: "Error", Error: "Internal server error" });
  }
};

exports.searchCommunities = async (req, res) => {
  const userId = req.userId;

  const { keyword } = req.params;

  try {
    const { rows } = await connection.query(
      `SELECT 
          c.community_id, 
          c.name, 
          c.description, 
          c.created_at, 
          c.subject, 
          c.class_level, 
          c.approval_status, 
          c.admin_id,
          c.created_at AS created_at,
          u.full_name AS admin_name,
          CASE 
              WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/users/profile/', u.user_picture)
              ELSE NULL
          END AS admin_picture,

          CASE 
              WHEN c.cover_image IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/communities/image/', c.community_id)
              ELSE NULL
          END AS cover_image_url,

          CASE 
              WHEN cm.membership_id IS NOT NULL THEN 1
              ELSE 0
          END AS is_member,

          COALESCE(member_count.total_members, 0) AS total_members

      FROM communities c

      LEFT JOIN users u 
          ON c.admin_id = u.user_id

      LEFT JOIN community_members cm 
          ON c.community_id = cm.community_id 
          AND cm.member_id = $1

      LEFT JOIN (
          SELECT community_id, COUNT(*) AS total_members
          FROM community_members
          GROUP BY community_id
      ) AS member_count
          ON c.community_id = member_count.community_id
          
      WHERE c.name ILIKE $2 OR c.description ILIKE $2
          
  LIMIT 3;`,
      [userId, `%${keyword}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getAllReportedPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await connection.query(
      `
      SELECT
        p.post_id,
        p.content,
        p.member_id,
        p.created_at,
        p.updated_at,
      
        -- Reactions count
        COALESCE(r.reaction_count, 0) AS reaction_count,
      
        -- Comments count
        COALESCE(c.comment_count, 0) AS comment_count,
        -- Reports count
        COALESCE(rep.report_count, 0) AS report_count,
      
        -- Media array with URLs
        COALESCE(m.media, '[]') AS media,
      
        -- Poster (Admin/User) information
        u.full_name AS author_name,
        CASE
          WHEN u.user_picture IS NOT NULL THEN CONCAT('https://jiggasha.onrender.com/profile/image/', u.user_id)
          ELSE NULL
        END AS author_picture
      FROM community_posts p
      -- Join reactions count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS reaction_count
        FROM community_post_reactions
        GROUP BY post_id
      ) r ON p.post_id = r.post_id

      -- Join comments count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM community_post_comments
        GROUP BY post_id
      ) c ON p.post_id = c.post_id

      -- Join reports count
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS report_count
        FROM post_reports
        GROUP BY post_id
      ) rep ON p.post_id = rep.post_id
      
      -- Join media with updated URL pattern
      LEFT JOIN (
        SELECT
          post_id,
          JSON_AGG(JSON_BUILD_OBJECT(
            'media_id', media_id,
            'media_type', media_type,
            'media_url', CONCAT('https://jiggasha.onrender.com/communities/postMedia/', media_id),
            'created_at', created_at
          ) ORDER BY created_at) AS media
        FROM community_post_media
        WHERE media_blob IS NOT NULL
        GROUP BY post_id
      ) m ON p.post_id = m.post_id

      -- Join user table
      LEFT JOIN users u ON p.member_id = u.user_id

      WHERE EXISTS (
        SELECT 1 
        FROM post_reports pr 
        WHERE pr.post_id = p.post_id 
        GROUP BY pr.post_id 
        HAVING COUNT(*) <= 10
      )

      ORDER BY p.created_at DESC;
      `
    );
    res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
