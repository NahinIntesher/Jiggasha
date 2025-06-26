const connection = require("../config/database");

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
        'SELECT question_id, content, option_a, option_b, option_c, option_d, correct_option FROM questions ORDER BY RANDOM() LIMIT $1',
        [count]
    );

    return rows.map(row => ({
        id: row.question_id,
        content: row.content,
        optionA: row.option_a,
        optionB: row.option_b,
        optionC: row.option_c,
        optionD: row.option_d,
        correctAnswer: row.correct_option // Store correct answer for server validation
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
        roundTimer: null, // Add timer reference
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

    // Clear any existing timer
    if (gameState.roundTimer) {
        clearTimeout(gameState.roundTimer);
    }

    let questions = [];
    let roundType = '';

    questions = await getRandomMCQ(5); // 5 MCQ questions per round
    roundType = 'mcq';
    gameState.questions[`round${roundNumber}`] = questions;

    // Emit round start to all players in room (don't send correct answers to clients)
    const questionsForClient = questions.map(q => {
        const { correctAnswer, ...questionWithoutAnswer } = q;
        return questionWithoutAnswer;
    });

    io.to(roomId).emit(`startRound${roundNumber}`, {
        roomId,
        roundNumber,
        roundType,
        questions: questionsForClient,
        players: gameState.players.map(p => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points
        }))
    });

    console.log(`Started Round ${roundNumber} for room ${roomId}, type: ${roundType}`);

    // Set round end timer (1 minute)
    gameState.roundTimer = setTimeout(() => {
        endRound(io, roomId, roundNumber);
    }, 60000); // 1 minute
}

// End a specific round
function endRound(io, roomId, roundNumber) {
    const gameState = gameStates[roomId];
    if (!gameState) return;

    gameState.roundActive = false;

    // Clear the timer
    if (gameState.roundTimer) {
        clearTimeout(gameState.roundTimer);
        gameState.roundTimer = null;
    }

    // Emit round end
    io.to(roomId).emit(`endRound${roundNumber}`, {
        roomId,
        roundNumber,
        players: gameState.players.map(p => ({
            user_id: p.user_id,
            full_name: p.full_name,
            user_picture_url: p.user_picture_url,
            points: p.points,
            roundScores: p.roundScores
        }))
    });

    console.log(`Ended Round ${roundNumber} for room ${roomId}`);

    // Start next round after 5 second delay, or end game
    if (roundNumber < 3) {
        setTimeout(() => {
            startRound(io, roomId, roundNumber + 1);
        }, 5000); // 5 second delay - increased for better UX
    } else {
        // End game after round 3
        setTimeout(() => {
            endGame(io, roomId);
        }, 5000); // 5 second delay before showing results
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
        user_id: player.user_id,
        full_name: player.full_name,
        user_picture_url: player.user_picture_url,
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

    // Clean up game state after a delay to allow clients to receive the results
    setTimeout(() => {
        delete gameStates[roomId];

        // Clean up room data
        if (gameState.mode === 'pair-to-pair') {
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

    const player = gameState.players.find(p => p.user_id === user_id);
    if (player) {
        player.roundScores[roundNumber - 1] += points;
        player.points += points;
        console.log(`Updated points for user ${user_id}: +${points} (total: ${player.points})`);
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
        console.log(`Questions not found for round ${roundNumber} in room ${roomId}`);
        return { isCorrect: false, points: 0 };
    }

    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
        console.log(`Question ${questionId} not found in round ${roundNumber}`);
        return { isCorrect: false, points: 0 };
    }

    const isCorrect = question.correctAnswer.toLowerCase() === answer.toLowerCase();
    const points = isCorrect ? 10 : 0; // 10 points for correct answer

    console.log(`Answer validation: Question ${questionId}, Answer: ${answer}, Correct: ${question.correctAnswer}, IsCorrect: ${isCorrect}, Points: ${points}`);
    
    return { isCorrect, points, correctAnswer: question.correctAnswer };
}

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Pair-to-pair battle join
        socket.on('joinPairBattle', async (userInfo) => {
            console.log('User joining pair battle:', userInfo, 'Socket:', socket.id);

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

            socket.emit('joinedPairBattle', { roomId });
            io.to(roomId).emit('playerListUpdate', pairRooms[roomId]);

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

            socket.emit('joinedBattleRoyale', { roomId });
            io.to(roomId).emit('playerListUpdate', royaleRooms[roomId]);

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

        // Handle player answers and update points - ENHANCED VERSION
        socket.on('submitAnswer', (data) => {
            console.log('Received submitAnswer:', data);
            
            const { roomId, userId, answer, questionId, roundNumber } = data;
            
            // Basic validation
            if (!roomId || !userId || !answer || !questionId || !roundNumber) {
                console.log('Missing required fields in submitAnswer:', data);
                socket.emit('answerResult', {
                    questionId,
                    isCorrect: false,
                    points: 0,
                    error: 'Missing required fields'
                });
                return;
            }

            // Validate the answer on server side
            const validation = validateAnswer(roomId, questionId, answer, roundNumber);
            
            console.log('Validation result:', validation);
            
            if (validation.isCorrect) {
                const updateSuccess = updatePlayerPoints(roomId, userId, validation.points, roundNumber);
                
                if (updateSuccess) {
                    // Emit updated scores to all players in room
                    const gameState = gameStates[roomId];
                    if (gameState) {
                        io.to(roomId).emit('scoreUpdate', {
                            roomId,
                            players: gameState.players.map(p => ({
                                user_id: p.user_id,
                                full_name: p.full_name,
                                user_picture_url: p.user_picture_url,
                                points: p.points,
                                roundScores: p.roundScores
                            }))
                        });
                        
                        console.log('Score update emitted for room:', roomId);
                    }
                } else {
                    console.log('Failed to update points for user:', userId);
                }
            }

            // Send answer result back to the specific player
            socket.emit('answerResult', {
                questionId,
                isCorrect: validation.isCorrect,
                points: validation.points,
                correctAnswer: validation.correctAnswer
            });
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
                    // Clean up game state and timers
                    if (gameStates[id]) {
                        if (gameStates[id].roundTimer) {
                            clearTimeout(gameStates[id].roundTimer);
                        }
                        delete gameStates[id];
                    }
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
                    // Clean up game state and timers
                    if (gameStates[id]) {
                        if (gameStates[id].roundTimer) {
                            clearTimeout(gameStates[id].roundTimer);
                        }
                        delete gameStates[id];
                    }
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