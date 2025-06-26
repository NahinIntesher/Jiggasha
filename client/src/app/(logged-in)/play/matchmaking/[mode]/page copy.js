"use client";

import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/components/Contexts/UserProvider";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loading from "@/components/ui/Loading";

const Matchmaking = () => {
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
    const [roundType, setRoundType] = useState(null)

    const onGameStart = (gameData) => {
        // Example: navigate to the game page with roomId or gameData
        if (mode === "pair") {
            // router.push(`/play/pair-to-pair/game?roomId=${gameData.roomId}`);
        } else if (mode === "royale") {
            // router.push(`/play/battle-royale/game?roomId=${gameData.roomId}`);
        }
        // Optionally, store gameData in state/context if needed
    };

    const submitAnswer = (questionId, answer) => {

    }

    useEffect(() => {
        console.log("Mode:", mode);
        console.log(mode);
        if (!user || !mode) return;

        // Create socket connection
        console.log("Creating socket connection to http://localhost:8000...");
        console.log("User info:", user);
        console.log("Mode:", mode);

        const newSocket = io("http://localhost:8000", {
            withCredentials: true,
            transports: ["websocket", "polling"], // Add polling as fallback
            forceNew: true, // Force new connection each time
            timeout: 5000 // 5 second timeout
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
                setRoundType(data.roundType)
                setQuestions(data.questions);
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
        }

        // Player list updates
        newSocket.on("playerListUpdate", (updatedPlayers) => {
            console.log("✅ Player list updated:", updatedPlayers);
            setPlayers(updatedPlayers);
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
            newSocket.disconnect();
        };
    }, [user]);

    // Show how many players are found (for UI feedback)
    const requiredPlayers = mode === "pair" ? 2 : 5;

    if (status == "connecting")
        return <Loading />;

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
                        <span className="text-[#ff7a1a]">{players.length} / {requiredPlayers}</span>
                    </div>
                    <div className="mb-6 text-gray-500 font-medium text-sm min-h-6">
                        Searching For Players ...
                    </div>
                    <div className="mb-6">
                        {players.length > 0 && (
                            <div className="overflow-x-auto">
                                <ul className={`list-none p-0 m-0 flex flex-row gap-3 items-center flex-nowrap min-w-[520px] transition-all duration-300 justify-center`}>
                                    {players.map((p, index) => (
                                        <li
                                            key={p.userId || p.socketId || index}
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
                        <span
                            className="inline-block w-9 h-9 border-4 border-[#ff7a1a] border-t-white rounded-full animate-spin"
                        />
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
                        Players: <span className="text-[#ff7a1a]">{players.length} / {requiredPlayers}</span>
                    </div>
                    <div className="mb-6">
                        {players.length > 0 && (
                            <div className="overflow-x-auto">
                                <ul className="list-none p-0 m-0 flex flex-row gap-3 items-center flex-nowrap min-w-[520px] transition-all duration-300 justify-center">
                                    {players.map((p, index) => (
                                        <li
                                            key={p.userId || p.socketId || index}
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
                    {/* <Countdown /> */}
                </div>
            </div>
        );

    if (status == "gameRunning")
        return (
            <div>
                <div>Round {round}</div>
                {roundType == "mcq" && (
                    <div>
                        <div >{questions[pivot]?.content}</div>
                        <div onClick={submitAnswer("a")}>{questions[pivot]?.optionA}</div>
                        <div onClick={submitAnswer("b")}>{questions[pivot]?.optionB}</div>
                        <div onClick={submitAnswer("c")}>{questions[pivot]?.optionC}</div>
                        <div onClick={submitAnswer("d")}>{questions[pivot]?.optionD}</div>
                    </div>
                )}      
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
            <div className="text-gray-500 text-md">
                Game will start in
            </div>
            <div className="text-6xl font-extrabold text-[#ff7a1a] m-2">
                {seconds}
            </div>
        </div>
    );
};

export default Matchmaking;