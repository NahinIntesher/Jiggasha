const connection = require("../config/database");

// -------------------
// Quest logic mapping
// -------------------

const QUEST_LOGIC = {
  "Complete 1 Material": { type: "materials_completed", target: 1 },
  "Complete 2 Materials": { type: "materials_completed", target: 2 },
  "Complete 5 Materials": { type: "materials_completed", target: 5 },
  "Complete 10 Materials": { type: "materials_completed", target: 10 },
  "Complete 20 Materials": { type: "materials_completed", target: 20 },
  "Complete 40 Materials": { type: "materials_completed", target: 40 },
  "Complete 80 Materials": { type: "materials_completed", target: 80 },
  "Complete 120 Materials": { type: "materials_completed", target: 120 },
  "Complete 200 Materials": { type: "materials_completed", target: 200 },
  "Complete 300 Materials": { type: "materials_completed", target: 300 },

  "Join 1 Battle": { type: "battles_joined", target: 1 },
  "Join 2 Battles": { type: "battles_joined", target: 2 },
  "Join 5 Battles": { type: "battles_joined", target: 5 },
  "Join 10 Battles": { type: "battles_joined", target: 10 },
  "Join 20 Battles": { type: "battles_joined", target: 20 },
  "Join 40 Battles": { type: "battles_joined", target: 40 },
  "Join 80 Battles": { type: "battles_joined", target: 80 },
  "Join 120 Battles": { type: "battles_joined", target: 120 },
  "Join 200 Battles": { type: "battles_joined", target: 200 },
  "Join 300 Battles": { type: "battles_joined", target: 300 },

  "Write 1 Blog": { type: "blog_posts_written", target: 1 },
  "Write 2 Blogs": { type: "blog_posts_written", target: 2 },
  "Write 5 Blogs": { type: "blog_posts_written", target: 5 },
  "Write 10 Blogs": { type: "blog_posts_written", target: 10 },
  "Write 20 Blogs": { type: "blog_posts_written", target: 20 },
  "Write 40 Blogs": { type: "blog_posts_written", target: 40 },
  "Write 80 Blogs": { type: "blog_posts_written", target: 80 },
  "Write 120 Blogs": { type: "blog_posts_written", target: 120 },
  "Write 200 Blogs": { type: "blog_posts_written", target: 200 },
  "Write 300 Blogs": { type: "blog_posts_written", target: 300 },
};

// ---------------------
// Get all quests status
// ---------------------

exports.getIncompleteQuests = async (req, res) => {
  const userId = req.userId;

  try {
    const [userStatsResult, allQuestsResult, userQuestsResult] =
      await Promise.all([
        connection.query("SELECT * FROM user_stats WHERE user_id = $1", [
          userId,
        ]),
        connection.query("SELECT * FROM quests ORDER BY created_at ASC"),
        connection.query("SELECT * FROM user_quests WHERE user_id = $1", [
          userId,
        ]),
      ]);

    const userStats = userStatsResult.rows[0] || {};
    const userQuests = Object.fromEntries(
      userQuestsResult.rows.map((q) => [q.quest_id, q])
    );

    const quests = allQuestsResult.rows
      .map((quest) => {
        const logic = QUEST_LOGIC[quest.title];
        const progress = logic ? userStats[logic.type] || 0 : 0;
        const isCompleted = logic ? progress >= logic.target : false;
        const claimed = !!userQuests[quest.quest_id]?.claimed_at;

        return {
          ...quest,
          progress,
          is_completed: isCompleted,
          claimed,
        };
      })
      .filter((quest) => !quest.is_completed);

    return res.json(quests);
  } catch (err) {
    console.error("Error fetching incomplete quests:", err);
    return res.status(500).json({ error: "Failed to load incomplete quests" });
  }
};

exports.getCompletedQuests = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing" });
  }

  try {
    const result = await connection.query(
      `
      SELECT q.*, uq.progress, uq.is_completed, uq.claimed_at
      FROM quests q
      INNER JOIN user_quests uq ON q.quest_id = uq.quest_id AND uq.user_id = $1
      WHERE uq.is_completed = true
      ORDER BY q.created_at ASC
      `,
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching completed quests:", error);
    return res.status(500).json({ error: "Failed to load completed quests" });
  }
};

// -------------------------------------
// Claim a reward for a completed quest
// -------------------------------------

exports.claimQuestReward = async (req, res) => {
  const userId = req.userId;
  const { quest_id } = req.body;

  try {
    const questRes = await connection.query(
      `SELECT * FROM quests WHERE quest_id = $1`,
      [quest_id]
    );
    if (questRes.rowCount === 0)
      return res.status(404).json({ error: "Quest not found" });

    const quest = questRes.rows[0];
    const logic = QUEST_LOGIC[quest.title];
    if (!logic)
      return res.status(400).json({ error: "Quest logic not defined" });

    const userStatRes = await connection.query(
      `SELECT * FROM user_stats WHERE user_id = $1`,
      [userId]
    );
    const userStats = userStatRes.rows[0] || {};
    const progress = userStats[logic.type] || 0;

    if (progress < logic.target) {
      return res.status(400).json({ error: "Quest not completed yet" });
    }

    await connection.query(
      `
      INSERT INTO user_quests (user_id, quest_id, progress, is_completed, claimed_at)
      VALUES ($1, $2, $3, true, NOW())
      ON CONFLICT (user_id, quest_id)
      DO UPDATE SET progress = $3, is_completed = true, claimed_at = NOW(), updated_at = NOW()
    `,
      [userId, quest_id, progress]
    );

    return res.json({
      message: "Reward claimed",
      reward: quest.reward_points || 0,
    });
  } catch (err) {
    console.error("Error claiming quest reward:", err);
    return res.status(500).json({ error: "Failed to claim quest reward" });
  }
};

// ----------------------------------
// Update completed quests in record
// ----------------------------------

exports.evaluateUserQuests = async (userId) => {
  try {
    const [userStatsRes, questsRes] = await Promise.all([
      connection.query(`SELECT * FROM user_stats WHERE user_id = $1`, [userId]),
      connection.query(`SELECT * FROM quests`),
    ]);

    const userStats = userStatsRes.rows[0] || {};
    const quests = questsRes.rows;

    for (const quest of quests) {
      const logic = QUEST_LOGIC[quest.title];
      if (!logic) continue;

      const progress = userStats[logic.type] || 0;

      if (progress >= logic.target) {
        await connection.query(
          `
          INSERT INTO user_quests (user_id, quest_id, progress, is_completed)
          VALUES ($1, $2, $3, true)
          ON CONFLICT (user_id, quest_id)
          DO UPDATE SET progress = $3, is_completed = true, updated_at = NOW()
        `,
          [userId, quest.quest_id, progress]
        );
      }
    }
  } catch (err) {
    console.error("Error evaluating quests:", err);
  }
};
