const { error } = require("console");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");

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
              WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/users/profile/', u.user_picture)
              ELSE NULL
          END AS admin_picture,

          CASE 
              WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/communities/image/', c.community_id)
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
              WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/users/profile/', u.user_picture)
              ELSE NULL
          END AS admin_picture,
        CASE
          WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/communities/image/', c.community_id)
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
        c.approval_status,
        c.admin_id,
        u.full_name AS admin_name,
          CASE 
              WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/users/profile/', u.user_picture)
              ELSE NULL
          END AS admin_picture,
        CASE
          WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/communities/image/', c.community_id)
          ELSE NULL
        END AS cover_image_url
      FROM communities c
      LEFT JOIN users u 
          ON c.admin_id = u.user_id
      LEFT JOIN (
        SELECT community_id, COUNT(*) AS total_members
        FROM community_members
        GROUP BY community_id
      ) AS member_count
        ON c.community_id = member_count.community_id
      WHERE c.community_id = $1;
      `,
      [communityId]
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

exports.addCommunity = [
  upload.single("coverImage"), // Middleware to handle file upload
  async (req, res) => {
    const userId = req.userId;

    const { name, description, classLevel, subject } = req.body;

    const coverImageBuffer = req.file ? req.file.buffer : null; // Get binary buffer

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

        // Optional: detect mime type or assume JPEG
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
  if (!communityId) {
    return res.status(400).json({ error: "Community ID is required" });
  }

  try {
    const result = await connection.query(
      `
      SELECT 
        p.post_id,
        p.title,
        p.content,
        p.member_id,
        p.is_pinned,
        p.view_count,
        p.approval_status,
        p.approval_date,
        p.created_at,
        p.updated_at,

        -- Is Edited (if content was updated after creation)
        CASE WHEN p.updated_at > p.created_at THEN true ELSE false END AS is_edited,

        -- Reactions count
        COALESCE(r.reaction_count, 0) AS reaction_count,

        -- Comments count
        COALESCE(c.comment_count, 0) AS comment_count,

        -- Media array
        COALESCE(m.media, '[]') AS media,

        -- Poster (Admin/User) information
        u.full_name AS author_name,
        CASE 
          WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/users/profile/', u.user_picture)
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

      -- Join media
      LEFT JOIN (
        SELECT post_id, 
              JSON_AGG(JSON_BUILD_OBJECT(
                'media_id', media_id,
                'media_type', media_type,
                'media_blob', media_blob,
                'created_at', created_at
              )) AS media
        FROM community_post_media
        GROUP BY post_id
      ) m ON p.post_id = m.post_id

      -- Join member/user table
      LEFT JOIN users u ON p.member_id = u.user_id  -- adjust 'users' and 'user_id' as per your schema

      WHERE p.community_id = $1
        AND p.approval_status = 'approved'

      ORDER BY p.is_pinned DESC, p.created_at DESC;
      `,
      [communityId]
    );

    res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
