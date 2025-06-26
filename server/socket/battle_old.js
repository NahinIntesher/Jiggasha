const connection = require("../config/database");
const { options } = require("../routes");

// In-memory room tracking
const pairRooms = {};
const royaleRooms = {};
let pairRoomCounter = 1;
let royaleRoomCounter = 1;

// Game state tracking
const gameStates = {};

// Helper to get random questions (replace with DB fetch)
async function getRandomMCQ(count) {
    const { rows } = await connection.query(
        'SELECT question_id, content, option_a, option_b, option_c, option_d, correct_option FROM questions ORDER BY RANDOM() LIMIT $1',
        [count]
    );

    return rows.map(row => ({
        id: row.question_id,
        content: row.content,
        optionA: row.option_a,
        optionB: row.option_b,
        optionC: row.option_c,
        optionD: row.option_d
    }));
}

async function getRandomMatching(count) {
    // TODO: Replace with DB query from battle_questions
    // Example static questions for now
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        questionOptions: ["Question A", "Question B", "Question C", "Question D"],
        answerOptions: ["Answer A", "Answer B", "Answer C", "Answer D"],
        correctMatches: { "Question A": "Answer A", "Question B": "Answer B", "Question C": "Answer C", "Question D": "Answer D" }
    }));
}

// Initialize game state for a room
function initializeGameState(roomId, players, mode) {
    gameStates[roomId] = {
        mode,
        players: players.map(player => ({
            ...player,
            points: 0,
            roundScores: [0, 0, 0] // Points for each round
        })),
        currentRound: 0,
        roundActive: false,
        questions: {
            round1: [],
            round2: [],
            round3: []
        }
    };
}

// Start a specific round
async function startRound(io, roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    gameState.currentRound = roundNumber;
    gameState.roundActive = true;

    let questions = [];
    let roundType = '';

    // Determine question type based on round
    if (roundNumber === 1 || roundNumber === 3) {
        questions = await getRandomMCQ(5); // 5 MCQ questions per round
        roundType = 'mcq';
        gameState.questions[`round${roundNumber}`] = questions;
    } else if (roundNumber === 2) {
        questions = await getRandomMatching(3); // 3 matching questions
        roundType = 'matching';
        gameState.questions.round2 = questions;
    }

    // Emit round start to all players in room
    io.to(roomId).emit(`startRound${roundNumber}`, {
        roomId,
        roundNumber,
        roundType,
        questions,
        players: gameState.players.map(p => ({
            username: p.username, 
            full_name: p.full_name, 
            user_picture_url: p.user_picture_url,
            points: p.points
        }))
    });

    console.log(`Started Round ${roundNumber} for room ${roomId}, type: ${roundType}`);

    // Set round end timer (1 minute)
    setTimeout(() => {
        endRound(io, roomId, roundNumber);
    }, 60000); // 1 minute
}

// End a specific round
function endRound(io, roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    gameState.roundActive = false;

    // Emit round end
    io.to(roomId).emit(`endRound${roundNumber}`, {
        roomId,
        roundNumber,
        players: gameState.players.map(p => ({
            username: p.username,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
            roundScores: p.roundScores
        }))
    });

    console.log(`Ended Round ${roundNumber} for room ${roomId}`);

    // Start next round after 1 minute delay, or end game
    if (roundNumber < 3) {
        setTimeout(() => {
            startRound(io, roomId, roundNumber + 1);
        }, 60000); // 1 minute delay
    } else {
        // End game after round 3
        setTimeout(() => {
            endGame(io, roomId);
        }, 60000); // 1 minute delay before showing results
    }
}

// End the entire game and show results
function endGame(io, roomId) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    // Sort players by total points (descending)
    const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);

    // Determine winners
    const results = sortedPlayers.map((player, index) => ({
        userId: player.userId,
        name: player.name,
        avatar: player.avatar,
        points: player.points,
        roundScores: player.roundScores,
        rank: index + 1
    }));

    // Emit game results
    io.to(roomId).emit('gameResults', {
        roomId,
        results,
        winner: results[0], // Player with highest points
        mode: gameState.mode
    });

    console.log(`Game ended for room ${roomId}. Results:`, results);

    // Clean up game state
    delete gameStates[roomId];

    // Clean up room data
    if (gameState.mode === 'pair-to-pair') {
        delete pairRooms[roomId];
    } else {
        delete royaleRooms[roomId];
    }
}

// Update player points
function updatePlayerPoints(roomId, userId, points, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    const player = gameState.players.find(p => p.username === username);
    if (player) {
        player.roundScores[roundNumber - 1] += points;
        player.points += points;
    }
}

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Pair-to-pair battle join
        socket.on('joinPairBattle', async (userInfo) => {
            console.log('User joining pair battle:', userInfo, 'Socket:', socket.id);

            // userInfo: { userId, name, avatar }
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

            console.log(`User ${socket.id} joined room ${roomId}. Current players:`, pairRooms[roomId]);

            // First emit to the joining user
            socket.emit('joinedPairBattle', { roomId });

            // Then emit updated player list to ALL users in room (including the one who just joined)
            io.to(roomId).emit('playerListUpdate', pairRooms[roomId]);
            console.log(`Emitted playerListUpdate to room ${roomId}:`, pairRooms[roomId]);

            if (pairRooms[roomId].length === 2) {
                const players = pairRooms[roomId];

                // Initialize game state
                initializeGameState(roomId, players, 'pair-to-pair');

                // Emit countdown first
                io.to(roomId).emit('startCountdown', { seconds: 5 });

                // Start the game after countdown
                setTimeout(() => {
                    io.to(roomId).emit('startPairBattle', {
                        roomId,
                        players,
                        mode: 'pair-to-pair'
                    });

                    // Start Round 1 immediately after game start
                    setTimeout(() => {
                        startRound(io, roomId, 1);
                    }, 1000);
                }, 5500);
            }
        });

        // Battle Royale join
        socket.on('joinBattleRoyale', async (userInfo) => {
            console.log('User joining battle royale:', userInfo, 'Socket:', socket.id);

            // userInfo: { userId, name, avatar }
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

            console.log(`User ${socket.id} joined room ${roomId}. Current players:`, royaleRooms[roomId]);

            // First emit to the joining user
            socket.emit('joinedBattleRoyale', { roomId });

            // Then emit updated player list to ALL users in room (including the one who just joined)
            io.to(roomId).emit('playerListUpdate', royaleRooms[roomId]);
            console.log(`Emitted playerListUpdate to room ${roomId}:`, royaleRooms[roomId]);

            if (royaleRooms[roomId].length === 5) {
                const players = royaleRooms[roomId];

                // Initialize game state
                initializeGameState(roomId, players, 'battle-royale');

                // Emit countdown first
                io.to(roomId).emit('startCountdown', { seconds: 5 });

                // Start the game after countdown
                setTimeout(() => {
                    io.to(roomId).emit('startBattleRoyale', {
                        roomId,
                        players,
                        mode: 'battle-royale'
                    });

                    // Start Round 1 immediately after game start
                    setTimeout(() => {
                        startRound(io, roomId, 1);
                    }, 1000);
                }, 5500);
            }
        });

        // Handle player answers and update points
        socket.on('submitAnswer', (data) => {
            const { roomId, userId, answer, questionId, roundNumber, isCorrect, points } = data;

            if (isCorrect) {
                updatePlayerPoints(roomId, userId, points, roundNumber);

                // Emit updated scores to all players in room
                const gameState = gameStates[roomId];
                if (gameState) {
                    io.to(roomId).emit('scoreUpdate', {
                        roomId,
                        players: gameState.players.map(p => ({
                            username: p.username,
                            full_name: p.full_name,
                            user_picture_url: p.user_picture_url,
                            points: p.points,
                            roundScores: p.roundScores
                        }))
                    });
                }
            }
        });

        // Pair battle actions (legacy support)
        socket.on('pairBattleAction', (data) => {
            socket.to(data.roomId).emit('pairBattleAction', data);
        });

        // Battle royale actions (legacy support)
        socket.on('battleRoyaleAction', (data) => {
            socket.to(data.roomId).emit('battleRoyaleAction', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnecting:', socket.id);

            // Remove from pair rooms and notify
            for (const [id, users] of Object.entries(pairRooms)) {
                const before = users.length;
                pairRooms[id] = users.filter(u => u.socketId !== socket.id);
                if (pairRooms[id].length === 0) {
                    delete pairRooms[id];
                    // Also clean up game state
                    delete gameStates[id];
                    console.log(`Deleted empty pair room: ${id}`);
                } else if (before !== pairRooms[id].length) {
                    console.log(`Updated pair room ${id}, players:`, pairRooms[id]);
                    io.to(id).emit('playerListUpdate', pairRooms[id]);
                }
            }

            // Remove from royale rooms and notify
            for (const [id, users] of Object.entries(royaleRooms)) {
                const before = users.length;
                royaleRooms[id] = users.filter(u => u.socketId !== socket.id);
                if (royaleRooms[id].length === 0) {
                    delete royaleRooms[id];
                    // Also clean up game state
                    delete gameStates[id];
                    console.log(`Deleted empty royale room: ${id}`);
                } else if (before !== royaleRooms[id].length) {
                    console.log(`Updated royale room ${id}, players:`, royaleRooms[id]);
                    io.to(id).emit('playerListUpdate', royaleRooms[id]);
                }
            }

            console.log('User disconnected:', socket.id);
        });
    });
};