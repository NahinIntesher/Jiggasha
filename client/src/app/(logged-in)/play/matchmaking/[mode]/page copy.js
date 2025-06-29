"use client";

import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/components/Contexts/UserProvider";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loading from "@/components/ui/Loading";

const Page = () => {
  const { user } = useUser();
  const { mode } = useParams();
  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [pivot, setPivot] = useState(0);
  const [round, setRound] = useState(null);
  const [roundType, setRoundType] = useState(null);
  const [playerScores, setPlayerScores] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [roundTimeLeft, setRoundTimeLeft] = useState(60);

  const onGameStart = (gameData) => {
    // Example: navigate to the game page with roomId or gameData
    if (mode === "pair") {
      // router.push(`/play/pair-to-pair/game?roomId=${gameData.roomId}`);
    } else if (mode === "royale") {
      // router.push(`/play/battle-royale/game?roomId=${gameData.roomId}`);
    }
    // Optionally, store gameData in state/context if needed
  };

  const submitAnswer = (selectedOption) => {
    return () => {
      if (hasAnswered || !socket || !questions[pivot]) return;

      const currentQuestion = questions[pivot];

      // Fixed: Use correct property names that match server expectations
      const answerData = {
        roomId,
        userId: user.user_id, // Make sure this matches server expectation
        questionId: currentQuestion.id, // Changed from question_id to id
        answer: selectedOption,
        roundNumber: round,
        timestamp: Date.now(),
        pivotIndex: pivot,
      };

      console.log("Submitting answer:", answerData);

      // Mark as answered and show selected answer
      setHasAnswered(true);
      setSelectedAnswer(selectedOption);

      // Send answer to server
      socket.emit("submitAnswer", answerData);

      // Move to next question after a short delay
      setTimeout(() => {
        if (pivot < questions.length - 1) {
          setPivot((prev) => prev + 1);
          setHasAnswered(false);
          setSelectedAnswer(null);
        } else {
          // All questions answered for this round
          console.log("All questions answered for round", round);
        }
      }, 1500); // 1.5 second delay to show the selected answer
    };
  };

  const nextQuestion = () => {
    if (pivot < questions.length - 1) {
      setPivot((prev) => prev + 1);
      setHasAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const skipQuestion = () => {
    if (!hasAnswered) {
      nextQuestion();
    }
  };

  useEffect(() => {
    console.log("Mode:", mode);
    console.log(mode);
    if (!user || !mode) return;

    // Create socket connection
    console.log("User info:", user);
    console.log("Mode:", mode);

    const newSocket = io("https://jiggasha.onrender.com/", {
      withCredentials: true,
      transports: ["websocket", "polling"], // Add polling as fallback
      forceNew: true, // Force new connection each time
      timeout: 5000, // 5 second timeout
    });

    setSocket(newSocket);

    // Handle connection
    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully:", newSocket.id);
      setIsConnected(true);
      setStatus("matchmaking");

      // Add current user to players list immediately
      setPlayers([user]);

      // Join appropriate battle mode after connection is established
      if (mode === "pair") {
        console.log("Joining pair battle with:", user);
        newSocket.emit("joinPairBattle", user);
      } else if (mode === "royale") {
        console.log("Joining battle royale with:", user);
        newSocket.emit("joinBattleRoyale", user);
      }
    });

    // Handle connection errors
    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setStatus("connectionLost");
    });

    // Handle disconnection
    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      setStatus("disconnected");
      setPlayers([]);
    });

    // Set up event listeners based on mode
    if (mode === "pair") {
      newSocket.on("joinedPairBattle", ({ roomId }) => {
        console.log("✅ Joined pair battle room:", roomId);
        setRoomId(roomId);
      });

      newSocket.on("startCountdown", (data) => {
        console.log("✅ Starting countdown for game:", data);
        setStatus("countdown");
      });

      newSocket.on("startPairBattle", (data) => {
        console.log("✅ Starting pair battle with data:", data);
        setPlayers(data.players);
        setStatus("gameRunning");
        onGameStart(data);
      });

      newSocket.on("startRound1", (data) => {
        console.log("✅ Starting round 1:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });

      newSocket.on("startRound2", (data) => {
        console.log("✅ Starting round 2:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });

      newSocket.on("startRound3", (data) => {
        console.log("✅ Starting round 3:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });
    } else if (mode === "royale") {
      newSocket.on("joinedBattleRoyale", ({ roomId }) => {
        console.log("✅ Joined battle royale room:", roomId);
        setRoomId(roomId);
      });

      newSocket.on("startCountdown", (data) => {
        console.log("✅ Starting countdown for game:", data);
        setStatus("countdown");
      });

      newSocket.on("startBattleRoyale", (data) => {
        console.log("✅ Starting battle royale with data:", data);
        setPlayers(data.players);
        setStatus("gameRunning");
        onGameStart(data);
      });

      // Add round listeners for battle royale too
      newSocket.on("startRound1", (data) => {
        console.log("✅ Starting round 1:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });

      newSocket.on("startRound2", (data) => {
        console.log("✅ Starting round 2:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });

      newSocket.on("startRound3", (data) => {
        console.log("✅ Starting round 3:", data);
        setRound(data.roundNumber);
        setRoundType(data.roundType);
        setQuestions(data.questions);
        setPivot(0);
        setHasAnswered(false);
        setSelectedAnswer(null);
        setRoundTimeLeft(60);
        setPlayerScores(data.players);
        setStatus("gameRunning"); // Ensure status is set correctly
      });
    }

    // Common event listeners
    newSocket.on("playerListUpdate", (updatedPlayers) => {
      console.log("✅ Player list updated:", updatedPlayers);
      setPlayers(updatedPlayers);
    });

    newSocket.on("scoreUpdate", (data) => {
      console.log("✅ Score updated:", data);
      setPlayerScores(data.players);
    });

    // Add listener for answer results
    newSocket.on("answerResult", (data) => {
      console.log("✅ Answer result received:", data);
      // You can show feedback to user here if needed
    });

    newSocket.on("gameResults", (data) => {
      console.log("✅ Game results:", data);
      setStatus("gameResults");
      setPlayerScores(data.results);
    });

    newSocket.on("endRound1", (data) => {
      console.log("✅ Round 1 ended:", data);
      setStatus("roundEnded");
      setPlayerScores(data.players);
    });

    newSocket.on("endRound2", (data) => {
      console.log("✅ Round 2 ended:", data);
      setStatus("roundEnded");
      setPlayerScores(data.players);
    });

    newSocket.on("endRound3", (data) => {
      console.log("✅ Round 3 ended:", data);
      setStatus("roundEnded");
      setPlayerScores(data.players);
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up socket connection...");
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.off("joinedPairBattle");
      newSocket.off("startPairBattle");
      newSocket.off("joinedBattleRoyale");
      newSocket.off("startBattleRoyale");
      newSocket.off("playerListUpdate");
      newSocket.off("scoreUpdate");
      newSocket.off("answerResult");
      newSocket.off("gameResults");
      newSocket.off("startRound1");
      newSocket.off("startRound2");
      newSocket.off("startRound3");
      newSocket.off("endRound1");
      newSocket.off("endRound2");
      newSocket.off("endRound3");
      newSocket.disconnect();
    };
  }, [user]);

  // Round timer effect
  useEffect(() => {
    if (status === "gameRunning" && roundTimeLeft > 0) {
      const timer = setTimeout(() => {
        setRoundTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [roundTimeLeft, status]);

  // Show how many players are found (for UI feedback)
  const requiredPlayers = mode === "pair" ? 2 : 5;

  if (status == "connecting") return <Loading />;

  if (status == "matchmaking")
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#fffaf3]">
        <div className="bg-white rounded-xl shadow-md border border-gray-300 px-10 pt-10 pb-8 min-w-[600px] max-w-[900px] w-[80%] text-center">
          <h2 className="text-[#ff7a1a] font-extrabold text-3xl mb-2 tracking-tight">
            Matchmaking
          </h2>
          <div className="text-gray-500 text-base mb-6 font-medium">
            {mode === "pair" ? "Pair-to-Pair Battle" : "Battle Royale"}
          </div>
          <div className="bg-orange-100 rounded-md py-3 mb-4 text-[#ff7a1a] font-semibold text-sm tracking-wide">
            Room ID: <span className="text-gray-900">{roomId || "..."}</span>
          </div>
          <div className="mb-4 text-gray-900 font-semibold text-lg">
            Players found:{" "}
            <span className="text-[#ff7a1a]">
              {players.length} / {requiredPlayers}
            </span>
          </div>
          <div className="mb-6 text-gray-500 font-medium text-sm min-h-6">
            Searching For Players ...
          </div>
          <div className="mb-6">
            {players.length > 0 && (
              <div className="overflow-x-auto">
                <ul
                  className={`list-none p-0 m-0 flex flex-row gap-3 items-center flex-nowrap min-w-[520px] transition-all duration-300 justify-center`}
                >
                  {players.map((p, index) => (
                    <li
                      key={p.username || p.socketId || index}
                      className="flex flex-col items-center bg-[#f5f5f7] rounded-lg px-4 py-2 min-w-[120px] border border-gray-200"
                    >
                      {p.user_picture_url && (
                        <img
                          src={p.user_picture_url}
                          alt="avatar"
                          width={36}
                          height={36}
                          className="rounded-full mb-1 border-2 border-gray-400 bg-white"
                        />
                      )}
                      <div className="font-bold text-gray-900 text-sm">
                        {p.full_name || p.username}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        @{p.username}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <span className="inline-block w-9 h-9 border-4 border-[#ff7a1a] border-t-white rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );

  if (status == "countdown")
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#fffaf3]">
        <div className="bg-white rounded-xl shadow-md border border-gray-300 px-10 pt-10 pb-8 min-w-[600px] max-w-[900px] w-[80%] text-center">
          <h2 className="text-[#ff7a1a] font-extrabold text-3xl mb-2 tracking-tight">
            Game Starting Soon!
          </h2>
          <div className="text-gray-500 text-base mb-6 font-medium">
            {mode === "pair" ? "Pair-to-Pair Battle" : "Battle Royale"}
          </div>
          <div className="bg-orange-100 rounded-md py-3 mb-4 text-[#ff7a1a] font-semibold text-sm tracking-wide">
            Room ID: <span className="text-gray-900">{roomId || "..."}</span>
          </div>
          <Countdown count={5} />
          <div className="mb-4 text-gray-900 font-semibold text-lg">
            Players:{" "}
            <span className="text-[#ff7a1a]">
              {players.length} / {requiredPlayers}
            </span>
          </div>
          <div className="mb-6">
            {players.length > 0 && (
              <div className="overflow-x-auto">
                <ul className="list-none p-0 m-0 flex flex-row gap-3 items-center flex-nowrap min-w-[520px] transition-all duration-300 justify-center">
                  {players.map((p, index) => (
                    <li
                      key={p.username || p.socketId || index}
                      className="flex flex-col items-center bg-[#f5f5f7] rounded-lg px-4 py-2 min-w-[120px] border border-gray-200"
                    >
                      {p.user_picture_url && (
                        <img
                          src={p.user_picture_url}
                          alt="avatar"
                          width={36}
                          height={36}
                          className="rounded-full mb-1 border-2 border-gray-400 bg-white"
                        />
                      )}
                      <div className="font-bold text-gray-900 text-sm">
                        {p.full_name || p.username}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        @{p.username}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  if (status == "gameRunning")
    return (
      <div className="min-h-[100dvh] bg-[#fffaf3] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#ff7a1a]">
                  Round {round}
                </h2>
                <p className="text-gray-500">
                  Question {pivot + 1} of {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#ff7a1a]">
                  {roundTimeLeft}s
                </div>
                <p className="text-gray-500">Time Left</p>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4 mb-4">
            <h3 className="font-bold text-lg mb-3">Scoreboard</h3>
            <div className="flex gap-4">
              {playerScores.map((player, index) => (
                <div
                  key={player.user_id}
                  className="bg-gray-100 rounded-lg p-3 flex-1"
                >
                  <div className="font-semibold">{player.full_name}</div>
                  <div className="text-[#ff7a1a] font-bold">
                    {player.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Section */}
          {roundType == "mcq" && questions[pivot] && (
            <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {questions[pivot]?.content}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((option) => {
                  const optionText = questions[pivot][`option${option}`];
                  const isSelected = selectedAnswer === option.toLowerCase();
                  const isDisabled = hasAnswered;

                  return (
                    <button
                      key={option}
                      onClick={submitAnswer(option.toLowerCase())}
                      disabled={isDisabled}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#ff7a1a] bg-orange-100 text-[#ff7a1a]"
                          : isDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-[#ff7a1a] hover:bg-orange-50"
                      }`}
                    >
                      <span className="font-semibold mr-2">{option}.</span>
                      {optionText}
                    </button>
                  );
                })}
              </div>

              {/* Skip button */}
              <div className="mt-6 text-center">
                <button
                  onClick={skipQuestion}
                  disabled={hasAnswered}
                  className="px-6 py-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                >
                  Skip Question →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  if (status == "roundEnded")
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#fffaf3]">
        <div className="bg-white rounded-xl shadow-md border border-gray-300 px-10 pt-10 pb-8 min-w-[600px] max-w-[900px] w-[80%] text-center">
          <h2 className="text-[#ff7a1a] font-extrabold text-3xl mb-2 tracking-tight">
            Round {round} Completed!
          </h2>
          {round !== 3 && (
            <div className="text-gray-500 text-base mb-6 font-medium">
              Waiting for next round...
            </div>
          )}

          {/* Current Scores */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Current Scores</h3>
            {playerScores.map((player, index) => (
              <div
                key={player.user_id}
                className="bg-gray-100 rounded-lg p-3 mb-2 flex justify-between items-center"
              >
                <span className="font-semibold">{player.full_name}</span>
                <span className="text-[#ff7a1a] font-bold">
                  {player.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (status == "gameResults")
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#fffaf3]">
        <div className="bg-white rounded-xl shadow-md border border-gray-300 px-10 pt-10 pb-8 min-w-[600px] max-w-[900px] w-[80%] text-center">
          <h2 className="text-[#ff7a1a] font-extrabold text-3xl mb-2 tracking-tight">
            Game Results
          </h2>
          <div className="text-gray-500 text-base mb-6 font-medium">
            {mode === "pair" ? "Pair-to-Pair Battle" : "Battle Royale"}{" "}
            Complete!
          </div>

          {/* Final Results */}
          <div className="mb-6">
            {playerScores.map((player, index) => (
              <div
                key={player.user_id}
                className={`rounded-lg p-4 mb-3 flex justify-between items-center ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{player.rank}</span>
                  <span className="font-semibold">
                    {player.full_name} {index === 0 ? "🏆" : ``}
                  </span>
                </div>
                <span className="text-[#ff7a1a] font-bold text-lg">
                  {player.points} pts
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/play")}
            className="bg-[#ff7a1a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Back to Play
          </button>
        </div>
      </div>
    );
};

const Countdown = ({ count }) => {
  const [seconds, setSeconds] = useState(count);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="m-6">
      <div className="text-gray-500 text-md">Game will start in</div>
      <div className="text-6xl font-extrabold text-[#ff7a1a] m-2">
        {seconds}
      </div>
    </div>
  );
};

export default Page;
