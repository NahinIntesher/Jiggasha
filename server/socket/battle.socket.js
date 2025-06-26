const connection = require("../config/database");

function registerBattleSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_battle", async ({ battleId, userId }) => {
      socket.join(battleId);
      console.log(`User ${userId} joined battle ${battleId}`);
    });

    socket.on("start_battle", async ({ battleId }) => {
      const { rows: questions } = await connection.query(
        `SELECT * FROM battle_questions WHERE battle_id = $1 ORDER BY sequence_order ASC`,
        [battleId]
      );

      for (const [i, q] of questions.entries()) {
        io.to(battleId).emit("new_question", {
          questionId: q.question_id,
          timeLimit: q.time_limit_seconds,
          sequence: i + 1,
        });

        await new Promise((res) => setTimeout(res, q.time_limit_seconds * 1000));
      }

      io.to(battleId).emit("battle_end");
    });

    socket.on("submit_answer", async ({ userId, battleId, questionId, selectedOption }) => {
      const { rows: correctRows } = await connection.query(
        `SELECT correct_option FROM questions WHERE question_id = $1`,
        [questionId]
      );
      const isCorrect = correctRows[0]?.correct_option === selectedOption;

      await connection.query(
        `INSERT INTO participant_answers (participant_id, battle_id, question_id, selected_option, is_correct, answered_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userId, battleId, questionId, selectedOption, isCorrect]
      );

      socket.emit("answer_result", { questionId, isCorrect });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = registerBattleSocket;
