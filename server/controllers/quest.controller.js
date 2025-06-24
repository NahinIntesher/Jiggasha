const connection = require("../config/database");

// Get incomplete quests
exports.getIncompleteQuests = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
    const userQuests = userQuestsResult.rows || [];
    const completedQuestIds = new Set(
      userQuests.filter((q) => q.is_completed).map((q) => q.quest_id)
    );

    const incompleteQuests = allQuestsResult.rows
      .filter((quest) => !completedQuestIds.has(quest.quest_id))
      .map((quest) => {
        const progress = userStats[quest.target_type] || 0;
        const claimed = !!userQuests.find(
          (q) => q.quest_id === quest.quest_id && q.claimed_at
        );

        return {
          quest_id: quest.quest_id,
          title: quest.title,
          reward_points: quest.reward_points,
          target_type: quest.target_type,
          created_at: quest.created_at,
          target: quest.target,
          progress,
          is_completed: false,
          claimed,
        };
      });

    return res.json(incompleteQuests);
  } catch (err) {
    console.error("Error fetching incomplete quests:", err);
    return res.status(500).json({ error: "Failed to load incomplete quests" });
  }
};

// Get completed quests
exports.getCompletedQuests = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await connection.query(
      `
      SELECT
        q.quest_id,
        q.title,
        q.reward_points,
        q.target_type,
        q.target,
        q.created_at,
        uq.progress,
        uq.is_completed,
        uq.claimed_at AS claimed
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

// Claim quest reward
exports.claimQuestReward = async (req, res) => {
  const userId = req.userId;
  const { quest_id } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!quest_id) return res.status(400).json({ error: "quest_id is required" });

  try {
    const questRes = await connection.query(
      `SELECT * FROM quests WHERE quest_id = $1`,
      [quest_id]
    );
    if (questRes.rowCount === 0)
      return res.status(404).json({ error: "Quest not found" });

    const quest = questRes.rows[0];
    const userStatRes = await connection.query(
      `SELECT * FROM user_stats WHERE user_id = $1`,
      [userId]
    );
    const userStats = userStatRes.rows[0] || {};
    const progress = userStats[quest.target_type] || 0;

    if (progress < quest.target) {
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

    await connection.query(
      `INSERT INTO user_rating (user_id, rating_point, earned_at) VALUES ($1, $2, NOW())`,
      [userId, quest.reward_points || 0]
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

// Evaluate user quests (backend maintenance utility)
exports.evaluateUserQuests = async (userId) => {
  try {
    const [userStatsRes, questsRes] = await Promise.all([
      connection.query(`SELECT * FROM user_stats WHERE user_id = $1`, [userId]),
      connection.query(`SELECT * FROM quests`),
    ]);

    const userStats = userStatsRes.rows[0] || {};
    const quests = questsRes.rows;

    for (const quest of quests) {
      const progress = userStats[quest.target_type] || 0;

      if (progress >= quest.target) {
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

exports.evaluateUserQuestsHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    await evaluateUserQuests(userId); // call the utility function
    res.json({ status: `Quests evaluated for user ${userId}` });
  } catch (error) {
    console.error("Error evaluating quests:", error);
    res.status(500).json({ error: "Failed to evaluate quests" });
  }
};
