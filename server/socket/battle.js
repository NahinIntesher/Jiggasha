const connection = require("../config/database");
const { evaluateUserQuests } = require("../controllers/quest.controller");

// In-memory room tracking
const pairRooms = {};
const royaleRooms = {};
let pairRoomCounter = 1;
let royaleRoomCounter = 1;

// Game state tracking
const gameStates = {};

// Helper to get random questions from database
async function getRandomMCQ(count) {
    const { rows } = await connection.query(
        "SELECT question_id, content, option_a, option_b, option_c, option_d, correct_option FROM questions ORDER BY RANDOM() LIMIT $1",
        [count]
    );

    return rows.map((row) => ({
        id: row.question_id,
        content: row.content,
        optionA: row.option_a,
        optionB: row.option_b,
        optionC: row.option_c,
        optionD: row.option_d,
        correctAnswer: row.correct_option, // Store correct answer for server validation
    }));
}

// Initialize game state for a room
function initializeGameState(roomId, players, mode) {
    gameStates[roomId] = {
        mode,
        totalRounds: mode === "battle-royale" ? 10 : 3,
        players: players.map((player) => ({
            ...player,
            points: 0,
            roundScores: mode === "battle-royale" ? [0, 0, 0, 0] : [0, 0, 0], // Points for each round
        })),
        eliminatedPlayers: [],
        currentRound: 0,
        roundActive: false,
        roundTimer: null, // Add timer reference
        gameStarted: false, // Track if game has started
        questions: {
            round1: [],
            round2: [],
            round3: [],
            ...(mode === "battle-royale" ? { round4: [] } : {}),
        },
        // NEW: Track player answers for each round
        playerAnswers: {
            round1: {}, // { userId: { questionId: answer, questionId2: answer2 } }
            round2: {},
            round3: {},
            ...(mode === "battle-royale" ? { round4: {} } : {}),
        },
    };
}

// NEW: Check if game should end due to insufficient players
function checkGameEndCondition(io, roomId) {
    const gameState = gameStates[roomId];
    if (!gameState || !gameState.gameStarted) return false;

    const activePlayers = gameState.players.length;
    const minPlayers = gameState.mode === "pair-to-pair" ? 2 : 2; // Minimum 2 players for both modes

    if (activePlayers < minPlayers) {
        console.log(
            `Game ending due to insufficient players in room ${roomId}. Active: ${activePlayers}, Required: ${minPlayers}`
        );

        // Clear any active round timer
        if (gameState.roundTimer) {
            clearTimeout(gameState.roundTimer);
            gameState.roundTimer = null;
        }

        endGame(io, roomId);

        const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

        // Emit game end due to player disconnect
        io.to(roomId).emit("gameEndedEarly", {
            roomId,
            reason: "insufficient_players",
            message: "Game ended because there are not enough players to continue.",
            remainingPlayers: sortedPlayers.map((p) => ({
                user_id: p.user_id,
                full_name: p.full_name,
                user_picture_url: p.user_picture_url,
                points: p.points,
                roundScores: p.roundScores,
            })),
            mode: gameState.mode,
        });

        // Clean up game state after a delay
        setTimeout(() => {
            delete gameStates[roomId];

            // Clean up room data
            if (gameState.mode === "pair-to-pair") {
                delete pairRooms[roomId];
            } else {
                delete royaleRooms[roomId];
            }
        }, 1000);

        return true;
    }

    return false;
}

// NEW: Remove player from game state
function removePlayerFromGameState(roomId, socketId) {
    const gameState = gameStates[roomId];
    if (!gameState) return false;

    const initialPlayerCount = gameState.players.length;
    gameState.players = gameState.players.filter((p) => p.socketId !== socketId);

    const playerRemoved = gameState.players.length < initialPlayerCount;

    if (playerRemoved) {
        console.log(
            `Player with socket ${socketId} removed from game state in room ${roomId}`
        );

        // Also clean up their answers from current round if round is active
        if (gameState.roundActive && gameState.currentRound > 0) {
            const currentRoundKey = `round${gameState.currentRound}`;
            const removedPlayer = Object.keys(
                gameState.playerAnswers[currentRoundKey] || {}
            ).find((userId) => {
                // This is a simplified check - in production you might want to maintain a socketId->userId mapping
                return true; // You might need to enhance this based on your user identification logic
            });
        }
    }

    return playerRemoved;
}

// NEW: Check if all players have answered all questions in current round
function checkAllPlayersAnswered(roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState || !gameState.roundActive) return false;

    const currentRoundKey = `round${roundNumber}`;
    const questions = gameState.questions[currentRoundKey];
    const playerAnswers = gameState.playerAnswers[currentRoundKey];

    if (!questions || questions.length === 0) return false;

    // Check if every player has answered every question
    for (const player of gameState.players) {
        const userId = player.user_id;
        const userAnswers = playerAnswers[userId] || {};

        // Check if this player has answered all questions
        for (const question of questions) {
            if (!userAnswers[question.id]) {
                return false; // This player hasn't answered this question
            }
        }
    }

    console.log(
        `All players have answered all questions in round ${roundNumber} for room ${roomId}`
    );
    return true;
}

// Start a specific round
async function startRound(io, roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    // Check if game should end due to insufficient players before starting round
    if (checkGameEndCondition(io, roomId)) {
        return;
    }

    gameState.currentRound = roundNumber;
    gameState.roundActive = true;

    // Clear any existing timer
    if (gameState.roundTimer) {
        clearTimeout(gameState.roundTimer);
    }

    // Initialize player answers for this round
    const currentRoundKey = `round${roundNumber}`;
    gameState.playerAnswers[currentRoundKey] = {};
    gameState.players.forEach((player) => {
        gameState.playerAnswers[currentRoundKey][player.user_id] = {};
    });

    let questions = [];
    let roundType = "";

    questions = await getRandomMCQ(5); // 5 MCQ questions per round
    roundType = "mcq";
    gameState.questions[currentRoundKey] = questions;

    // Emit round start to all players in room (don't send correct answers to clients)
    const questionsForClient = questions.map((q) => {
        const { correctAnswer, ...questionWithoutAnswer } = q;
        return questionWithoutAnswer;
    });

    const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

    io.to(roomId).emit(`startRound`, {
        roomId,
        roundNumber,
        roundType,
        questions: questionsForClient,
        players: sortedPlayers.map((p) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
        })),
        eliminatedPlayers: gameState.eliminatedPlayers.map((p) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
        })),
    });

    console.log(
        `Started Round ${roundNumber} for room ${roomId}, type: ${roundType}`
    );

    // Set round end timer (1 minute)
    gameState.roundTimer = setTimeout(() => {
        endRound(io, roomId, roundNumber);
    }, 60000); // 1 minute
}

// End a specific round
function endRound(io, roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    // Check if game should end due to insufficient players
    if (checkGameEndCondition(io, roomId)) {
        return;
    }

    gameState.roundActive = false;

    // Clear the timer
    if (gameState.roundTimer) {
        clearTimeout(gameState.roundTimer);
        gameState.roundTimer = null;
    }

    if (gameState.mode == "battle-royale" && roundNumber < gameState.totalRounds) {
        // Find the minimum points
        const minPoints = Math.min(...gameState.players.map(p => p.points));

        // Find all players with the minimum points (in case of tie)
        const newEliminatedPlayers = gameState.players.filter(p => p.points === minPoints);

        // Remove eliminated players from the game state
        if (newEliminatedPlayers.length !== gameState.players.length) {
            // Merge and sort all eliminated players by points (descending)
            gameState.eliminatedPlayers = [
                ...gameState.eliminatedPlayers,
                ...newEliminatedPlayers
            ].sort((a, b) => b.points - a.points);

            gameState.players = gameState.players.filter(p => p.points !== minPoints);

            // Notify eliminated players individually
            let sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

            newEliminatedPlayers.forEach(p => {
                if (p.socketId) {
                    io.to(p.socketId).emit("eliminated", {
                        roomId,
                        roundNumber,
                        players: sortedPlayers.map((p) => ({
                            user_id: p.user_id,
                            full_name: p.full_name,
                            user_picture_url: p.user_picture_url,
                            points: p.points,
                            roundScores: p.roundScores,
                        })),
                        eliminatedPlayers: gameState.eliminatedPlayers.map((p) => ({
                            user_id: p.user_id,
                            full_name: p.full_name,
                            user_picture_url: p.user_picture_url,
                            points: p.points,
                            roundScores: p.roundScores,
                        }))
                    });
                }
            });
        }

        // If only one player remains, end the game immediately
        if (gameState.players.length === 1) {
            setTimeout(() => {
                endGame(io, roomId);
            }, 3000);
            return;
        }
    }

    const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

    // Emit round end
    io.to(roomId).emit(`endRound`, {
        roomId,
        roundNumber,
        players: sortedPlayers.map((p) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
            roundScores: p.roundScores,
        })),
        eliminatedPlayers: gameState.eliminatedPlayers.map((p) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
            roundScores: p.roundScores,
        }))
    });

    console.log(`Ended Round ${roundNumber} for room ${roomId}`);

    // Start next round after 5 second delay, or end game
    if (roundNumber < gameState.totalRounds) {
        setTimeout(() => {
            // Double-check player count before starting next round
            if (!checkGameEndCondition(io, roomId)) {
                startRound(io, roomId, roundNumber + 1);
            }
        }, 5000); // 5 second delay - increased for better UX
    } else {
        // End game after total round (3 or 4)
        setTimeout(() => {
            endGame(io, roomId);
        }, 5000); // 5 second delay before showing results
    }
}

// End the entire game and show results
async function endGame(io, roomId) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    // Sort players by total points (descending)
    const sortedPlayers = [...gameState.players].sort(
        (a, b) => b.points - a.points
    );

    // Determine winners
    const results = sortedPlayers.map((player, index) => ({
        user_id: player.user_id,
        full_name: player.full_name,
        user_picture_url: player.user_picture_url,
        points: player.points,
        roundScores: player.roundScores,
        rank: index + 1,
    }));

    // Emit game results
    io.to(roomId).emit("gameResults", {
        roomId,
        results,
        eliminatedPlayers: gameState.eliminatedPlayers.map((p) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
            roundScores: p.roundScores,
        })),
        winner: results[0], // Player with highest points
        mode: gameState.mode,
    });

    try {
        // Insert battle and get generated id
        const battleResult = await connection.query(
            "INSERT INTO battles (battle_type) VALUES ($1) RETURNING battle_id",
            [gameState.mode]
        );
        const battleId = battleResult.rows[0].battle_id;

        results.forEach(async (player, index) => {
            if (index == 0) {
                await connection.query(
                    "INSERT INTO user_rating (user_id, rating_point) VALUES ($1, $2)",
                    [player.user_id, 3]
                );
                await connection.query(
                    "INSERT INTO battle_participants (battle_id, participant_id, score, rank, is_won) VALUES ($1, $2, $3, $4, $5)",
                    [battleId, player.user_id, player.points, index + 1, true]
                );
            }
            else {
                await connection.query(
                    "INSERT INTO user_rating (user_id, rating_point) VALUES ($1, $2)",
                    [player.user_id, -1.5]
                );
                await connection.query(
                    "INSERT INTO battle_participants (battle_id, participant_id, score, rank, is_won) VALUES ($1, $2, $3, $4, $5)",
                    [battleId, player.user_id, player.points, index + 1, false]
                );
            }
        });

        gameState.eliminatedPlayers.forEach(async (player, index) => {
            await connection.query(
                "INSERT INTO user_rating (user_id, rating_point) VALUES ($1, $2)",
                [player.user_id, -1.5]
            );
            await connection.query(
                "INSERT INTO battle_participants (battle_id, participant_id, score, rank, is_won) VALUES ($1, $2, $3, $4, $5)",
                [battleId, player.user_id, player.points, (results.length+index+1), false]
            );
        });

        await connection.query(
            `INSERT INTO user_stats (user_id, pair_battles_won)
               VALUES ($1, 1)
               ON CONFLICT (user_id)
               DO UPDATE SET pair_battles_won = user_stats.pair_battles_won + 1`,
            [results[0].user_id]
        );

        await evaluateUserQuests(results[0].user_id);
    } catch (updateErr) {
        console.error("Failed to update user stats or evaluate quests:", updateErr);
    }

    console.log(`Game ended for room ${roomId}. Results:`, results);

    // Clean up game state after a delay to allow clients to receive the results
    setTimeout(() => {
        delete gameStates[roomId];

        // Clean up room data
        if (gameState.mode === "pair-to-pair") {
            delete pairRooms[roomId];
        } else {
            delete royaleRooms[roomId];
        }
    }, 1000);
}

// Update player points
function updatePlayerPoints(roomId, user_id, points, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) {
        console.log(`Game state not found for room ${roomId}`);
        return false;
    }

    const player = gameState.players.find((p) => p.user_id === user_id);
    console.log("updatePlayerPoints", points);
    if (player) {
        player.roundScores[roundNumber - 1] += points;
        player.points += points;
        console.log(
            `Updated points for user ${user_id}: +${points} (total: ${player.points})`
        );
        return true;
    } else {
        console.log(`Player ${user_id} not found in room ${roomId}`);
        return false;
    }
}

// Validate answer and calculate points
function validateAnswer(roomId, questionId, answer, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) {
        console.log(`Game state not found for room ${roomId}`);
        return { isCorrect: false, points: 0 };
    }

    if (!gameState.roundActive) {
        console.log(`Round not active for room ${roomId}`);
        return { isCorrect: false, points: 0 };
    }

    const questions = gameState.questions[`round${roundNumber}`];
    if (!questions) {
        console.log(
            `Questions not found for round ${roundNumber} in room ${roomId}`
        );
        return { isCorrect: false, points: 0 };
    }

    const question = questions.find((q) => q.id === questionId);

    if (!question) {
        console.log(`Question ${questionId} not found in round ${roundNumber}`);
        return { isCorrect: false, points: 0 };
    }

    const isCorrect =
        question.correctAnswer.toLowerCase() === answer.toLowerCase();

    const points = isCorrect ? 10 : answer == "skip" ? 0 : -5; // 10 points for correct answer

    console.log("Point: ", points);

    console.log(
        `Answer validation: Question ${questionId}, Answer: ${answer}, Correct: ${question.correctAnswer}, IsCorrect: ${isCorrect}, Points: ${points}`
    );

    return { isCorrect, points, correctAnswer: question.correctAnswer };
}

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Pair-to-pair battle join
        socket.on("joinPairBattle", async (userInfo) => {
            console.log("User joining pair battle:", userInfo, "Socket:", socket.id);

            let roomId = null;
            for (const [id, users] of Object.entries(pairRooms)) {
                if (users.length === 1) {
                    roomId = id;
                    break;
                }
            }
            if (!roomId) {
                roomId = `pair_${pairRoomCounter++}`;
                pairRooms[roomId] = [];
            }

            pairRooms[roomId].push({ ...userInfo, socketId: socket.id });
            socket.join(roomId);

            console.log(
                `User ${socket.id} joined room ${roomId}. Current players:`,
                pairRooms[roomId]
            );

            socket.emit("joinedPairBattle", { roomId });
            io.to(roomId).emit("playerListUpdate", pairRooms[roomId]);

            if (pairRooms[roomId].length === 2) {
                const players = pairRooms[roomId];

                // Initialize game state
                initializeGameState(roomId, players, "pair-to-pair");

                // Emit countdown first
                io.to(roomId).emit("startCountdown", { seconds: 5 });

                // Start the game after countdown
                setTimeout(() => {
                    // Mark game as started
                    if (gameStates[roomId]) {
                        gameStates[roomId].gameStarted = true;
                    }

                    io.to(roomId).emit("startPairBattle", {
                        roomId,
                        players,
                        mode: "pair-to-pair",
                    });

                    // Start Round 1 immediately after game start
                    setTimeout(() => {
                        startRound(io, roomId, 1);
                    }, 1000);
                }, 5500);
            }
        });

        // Battle Royale join
        socket.on("joinBattleRoyale", async (userInfo) => {
            console.log(
                "User joining battle royale:",
                userInfo,
                "Socket:",
                socket.id
            );

            let roomId = null;
            for (const [id, users] of Object.entries(royaleRooms)) {
                if (users.length < 5) {
                    roomId = id;
                    break;
                }
            }
            if (!roomId) {
                roomId = `royale_${royaleRoomCounter++}`;
                royaleRooms[roomId] = [];
            }

            royaleRooms[roomId].push({ ...userInfo, socketId: socket.id });
            socket.join(roomId);

            console.log(
                `User ${socket.id} joined room ${roomId}. Current players:`,
                royaleRooms[roomId]
            );

            socket.emit("joinedBattleRoyale", { roomId });
            io.to(roomId).emit("playerListUpdate", royaleRooms[roomId]);

            if (royaleRooms[roomId].length === 4) {
                const players = royaleRooms[roomId];

                // Initialize game state
                initializeGameState(roomId, players, "battle-royale");

                // Emit countdown first
                io.to(roomId).emit("startCountdown", { seconds: 5 });

                // Start the game after countdown
                setTimeout(() => {
                    // Mark game as started
                    if (gameStates[roomId]) {
                        gameStates[roomId].gameStarted = true;
                    }

                    io.to(roomId).emit("startBattleRoyale", {
                        roomId,
                        players,
                        mode: "battle-royale",
                    });

                    // Start Round 1 immediately after game start
                    setTimeout(() => {
                        startRound(io, roomId, 1);
                    }, 1000);
                }, 5500);
            }
        });

        // Handle player answers and update points - ENHANCED VERSION WITH AUTO ROUND END
        socket.on("submitAnswer", (data) => {
            console.log("Received submitAnswer:", data);

            const { roomId, userId, answer, questionId, roundNumber } = data;

            console.log("Ador", roundNumber);

            // Basic validation
            if (!roomId || !userId || !answer || !questionId || !roundNumber) {
                console.log("Missing required fields in submitAnswer:", data);
                socket.emit("answerResult", {
                    questionId,
                    isCorrect: false,
                    points: 0,
                    error: "Missing required fields",
                });
                return;
            }

            const gameState = gameStates[roomId];
            if (!gameState || !gameState.roundActive) {
                console.log("Game not active or room not found:", roomId);
                socket.emit("answerResult", {
                    questionId,
                    isCorrect: false,
                    points: 0,
                    error: "Game not active",
                });
                return;
            }

            // NEW: Record the player's answer
            const currentRoundKey = `round${roundNumber}`;
            if (!gameState.playerAnswers[currentRoundKey]) {
                gameState.playerAnswers[currentRoundKey] = {};
            }
            if (!gameState.playerAnswers[currentRoundKey][userId]) {
                gameState.playerAnswers[currentRoundKey][userId] = {};
            }

            // Check if player already answered this question
            if (gameState.playerAnswers[currentRoundKey][userId][questionId]) {
                console.log(`Player ${userId} already answered question ${questionId}`);
                socket.emit("answerResult", {
                    questionId,
                    isCorrect: false,
                    points: 0,
                    error: "Already answered this question",
                });
                return;
            }

            // Record the answer
            gameState.playerAnswers[currentRoundKey][userId][questionId] = answer;

            // Validate the answer on server side
            const validation = validateAnswer(
                roomId,
                questionId,
                answer,
                roundNumber
            );

            console.log("Validation result:", validation);

            // if (validation.isCorrect) {
            if (true) {
                const updateSuccess = updatePlayerPoints(
                    roomId,
                    userId,
                    validation.points,
                    roundNumber
                );

                if (updateSuccess) {
                    // Emit updated scores to all players in room
                    // Sort players by points (descending) before emitting
                    const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

                    io.to(roomId).emit("scoreUpdate", {
                        roomId,
                        players: sortedPlayers.map((p) => ({
                            user_id: p.user_id,
                            full_name: p.full_name,
                            user_picture_url: p.user_picture_url,
                            points: p.points,
                            roundScores: p.roundScores,
                        })),
                        eliminatedPlayers: gameState.eliminatedPlayers.map((p) => ({
                            user_id: p.user_id,
                            full_name: p.full_name,
                            user_picture_url: p.user_picture_url,
                            points: p.points,
                            roundScores: p.roundScores,
                        }))
                    });

                    console.log("Score update emitted for room:", roomId);
                } else {
                    console.log("Failed to update points for user:", userId);
                }
            }

            // Send answer result back to the specific player
            socket.emit("answerResult", {
                questionId,
                isCorrect: validation.isCorrect,
                points: validation.points,
                correctAnswer: validation.correctAnswer,
            });

            // NEW: Check if all players have answered all questions
            if (checkAllPlayersAnswered(roomId, roundNumber)) {
                console.log(
                    `All players completed round ${roundNumber} in room ${roomId} - ending round early`
                );

                // Emit notification that round is ending early
                io.to(roomId).emit("roundEndingEarly", {
                    roomId,
                    roundNumber,
                    reason: "All players completed",
                });

                // End the round after a short delay to let players see their final answer
                setTimeout(() => {
                    endRound(io, roomId, roundNumber);
                }, 2000); // 2 second delay for better UX
            }
        });

        // Pair battle actions (legacy support)
        socket.on("pairBattleAction", (data) => {
            socket.to(data.roomId).emit("pairBattleAction", data);
        });

        // Battle royale actions (legacy support)
        socket.on("battleRoyaleAction", (data) => {
            socket.to(data.roomId).emit("battleRoyaleAction", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnecting:", socket.id);

            // Remove from pair rooms and notify
            for (const [id, users] of Object.entries(pairRooms)) {
                const before = users.length;
                pairRooms[id] = users.filter((u) => u.socketId !== socket.id);

                // ENHANCED: Check if player was removed and update game state
                if (before !== pairRooms[id].length) {
                    console.log(
                        `Player disconnected from pair room ${id}, players before: ${before}, after: ${pairRooms[id].length}`
                    );

                    // Remove player from game state
                    if (gameStates[id]) {
                        removePlayerFromGameState(id, socket.id);

                        // Check if game should end due to insufficient players
                        if (!checkGameEndCondition(io, id)) {
                            // If game doesn't end, update player list
                            io.to(id).emit("playerListUpdate", pairRooms[id]);

                            // Also emit updated scores if game is active
                            if (gameStates[id] && gameStates[id].gameStarted) {
                                const sortedPlayers = [...gameStates[id].players].sort((a, b) => b.points - a.points);

                                io.to(id).emit("scoreUpdate", {
                                    roomId: id,
                                    players: sortedPlayers.map((p) => ({
                                        user_id: p.user_id,
                                        full_name: p.full_name,
                                        user_picture_url: p.user_picture_url,
                                        points: p.points,
                                        roundScores: p.roundScores,
                                    })),
                                    eliminatedPlayers: gameStates[id].eliminatedPlayers.map((p) => ({
                                        user_id: p.user_id,
                                        full_name: p.full_name,
                                        user_picture_url: p.user_picture_url,
                                        points: p.points,
                                        roundScores: p.roundScores,
                                    }))
                                });
                            }
                        }
                    } else {
                        io.to(id).emit("playerListUpdate", pairRooms[id]);
                    }
                }

                if (pairRooms[id].length === 0) {
                    delete pairRooms[id];
                    // Clean up game state and timers
                    if (gameStates[id]) {
                        if (gameStates[id].roundTimer) {
                            clearTimeout(gameStates[id].roundTimer);
                        }
                        delete gameStates[id];
                    }
                    console.log(`Deleted empty pair room: ${id}`);
                }
            }

            // Remove from royale rooms and notify
            for (const [id, users] of Object.entries(royaleRooms)) {
                const before = users.length;
                royaleRooms[id] = users.filter((u) => u.socketId !== socket.id);

                // ENHANCED: Check if player was removed and update game state
                if (before !== royaleRooms[id].length) {
                    console.log(
                        `Player disconnected from royale room ${id}, players before: ${before}, after: ${royaleRooms[id].length}`
                    );

                    // Remove player from game state
                    if (gameStates[id]) {
                        removePlayerFromGameState(id, socket.id);

                        // Check if game should end due to insufficient players
                        if (!checkGameEndCondition(io, id)) {
                            // If game doesn't end, update player list
                            io.to(id).emit("playerListUpdate", royaleRooms[id]);

                            // Also emit updated scores if game is active
                            if (gameStates[id] && gameStates[id].gameStarted) {
                                const sortedPlayers = [...gameStates[id].players].sort((a, b) => b.points - a.points);

                                io.to(id).emit("scoreUpdate", {
                                    roomId: id,
                                    players: sortedPlayers.map((p) => ({
                                        user_id: p.user_id,
                                        full_name: p.full_name,
                                        user_picture_url: p.user_picture_url,
                                        points: p.points,
                                        roundScores: p.roundScores,
                                    })),
                                    eliminatedPlayers: gameStates[id].eliminatedPlayers.map((p) => ({
                                        user_id: p.user_id,
                                        full_name: p.full_name,
                                        user_picture_url: p.user_picture_url,
                                        points: p.points,
                                        roundScores: p.roundScores,
                                    })),
                                });
                            }
                        }
                    } else {
                        io.to(id).emit("playerListUpdate", royaleRooms[id]);
                    }
                }

                if (royaleRooms[id].length === 0) {
                    delete royaleRooms[id];
                    // Clean up game state and timers
                    if (gameStates[id]) {
                        if (gameStates[id].roundTimer) {
                            clearTimeout(gameStates[id].roundTimer);
                        }
                        delete gameStates[id];
                    }
                    console.log(`Deleted empty royale room: ${id}`);
                }
            }

            console.log("User disconnected:", socket.id);
        });
    });
};
