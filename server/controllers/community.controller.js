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
      `SELECT c.community_id, c.name, c.description, c.created_at, c.subject, c.class_level, c.approval_status, c.admin_id,
      CASE 
      WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/communities/image/', c.community_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url,
      COALESCE(bv.vote, 0) AS is_voted,
      COALESCE(v_c.total_vote, 0) AS vote_count
      FROM communities c
      JOIN users u ON c.admin_id = u.user_id
      LEFT JOIN community_votes bv 
      ON bv.community_id = c.community_id AND bv.voter_id = $1
      LEFT JOIN (
        SELECT community_id, SUM(vote) AS total_vote
        FROM community_votes
        GROUP BY community_id
      ) v_c ON v_c.community_id = c.community_id
      WHERE c.admin_id = $2;
      `,
      [userId, userId]
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
      `SELECT c.community_id, c.name, c.description, c.created_at, c.subject, c.class_level, c.approval_status, c.admin_id,
      CASE 
      WHEN c.cover_image IS NOT NULL THEN CONCAT('http://localhost:8000/communities/image/', c.community_id)
      ELSE NULL
      END AS cover_image_url,
      u.full_name AS author_name,
      CASE
      WHEN u.user_picture IS NOT NULL THEN CONCAT('http://localhost:8000/profile/image/', u.user_id)
      ELSE NULL
      END AS author_picture_url,
      COALESCE(bv.vote, 0) AS is_voted,
      COALESCE(v_c.total_vote, 0) AS vote_count
      FROM communities c
      JOIN users u ON c.admin_id = u.user_id
      LEFT JOIN community_votes bv 
      ON bv.community_id = c.community_id AND bv.voter_id = $1
      LEFT JOIN (
        SELECT community_id, SUM(vote) AS total_vote
        FROM community_votes
        GROUP BY community_id
      ) v_c ON v_c.community_id = c.community_id
       WHERE c.community_id = $2;
      `,
      [userId, communityId]
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
  const { communityId } = req.body;

  try {
    // Validate input
    if (!communityId) {
      return res.status(400).json({ 
        success: false, 
        error: "Community ID is required" 
      });
    }

    // Check if community exists
    const { rows: communityExists } = await connection.query(
      `SELECT id FROM communities WHERE id = $1`,
      [communityId]
    );
    
    if (communityExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Community not found" 
      });
    }

    // Check if the user is already a member
    const { rows: existingMember } = await connection.query(
      `SELECT * FROM community_members WHERE member_id = $1 AND community_id = $2`,
      [userId, communityId]
    );

    if (existingMember.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: "Already a member of this community" 
      });
    }

    // Insert new membership
    await connection.query(
      `INSERT INTO community_members (member_id, community_id, joined_at) VALUES ($1, $2, NOW())`,
      [userId, communityId]
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
        totalMembers: parseInt(memberCount[0].total_members)
      }
    });

  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};