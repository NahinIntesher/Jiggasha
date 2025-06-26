import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Matchmaking = ({ mode, userInfo, onGameStart }) => {
    const [players, setPlayers] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [status, setStatus] = useState("Connecting...");
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        console.log("Mode:", mode);
        console.log(mode);
        if (!mode) return;

        // Create socket connection
        console.log("Creating socket connection to http://localhost:8000...");
        console.log("User info:", userInfo);
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
            setStatus("Finding players...");
            
            // Add current user to players list immediately
            setPlayers([userInfo]);
            
            // Join appropriate battle mode after connection is established
            if (mode === "pair") {
                console.log("Joining pair battle with:", userInfo);
                newSocket.emit("joinPairBattle", userInfo);
            } else if (mode === "royale") {
                console.log("Joining battle royale with:", userInfo);
                newSocket.emit("joinBattleRoyale", userInfo);
            }
        });

        // Handle connection errors
        newSocket.on("connect_error", (error) => {
            console.error("❌ Connection error:", error);
            setStatus(`Connection failed: ${error.message}`);
        });

        // Handle disconnection
        newSocket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
            setIsConnected(false);
            setStatus("Disconnected. Reconnecting...");
            setPlayers([]);
        });

        // Set up event listeners based on mode
        if (mode === "pair") {
            newSocket.on("joinedPairBattle", ({ roomId }) => {
                console.log("✅ Joined pair battle room:", roomId);
                setRoomId(roomId);
            });
            
            newSocket.on("startPairBattle", (data) => {
                console.log("✅ Starting pair battle with data:", data);
                setPlayers(data.players);
                setStatus("Game starting!");
                onGameStart(data);
            });
        } else if (mode === "royale") {
            newSocket.on("joinedBattleRoyale", ({ roomId }) => {
                console.log("✅ Joined battle royale room:", roomId);
                setRoomId(roomId);
            });
            
            newSocket.on("startBattleRoyale", (data) => {
                console.log("✅ Starting battle royale with data:", data);
                setPlayers(data.players);
                setStatus("Game starting!");
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
    }, [mode, userInfo, onGameStart]);

    // Show how many players are found (for UI feedback)
    const requiredPlayers = mode === "pair" ? 2 : 5;

    return (
        <div style={{ textAlign: "center", marginTop: 40 }}>
            <h2>Matchmaking ({mode === "pair" ? "Pair-to-Pair" : "Battle Royale"})</h2>
            <p>Room: {roomId || "..."}</p>
            <p>
                Players found: {players.length} / {requiredPlayers}
            </p>
            <p>{status}</p>
            <div style={{ marginTop: 20 }}>
                {/* Show avatars/names of found players */}
                {players.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {players.map((p, index) => (
                            <li key={p.userId || p.socketId || index}>
                                {p.avatar && (
                                    <img 
                                        src={p.avatar} 
                                        alt="avatar" 
                                        width={32} 
                                        style={{ borderRadius: "50%", marginRight: 8 }} 
                                    />
                                )}
                                {p.name || p.userId || p.socketId}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div style={{ marginTop: 40 }}>
                <span className="loader" />
            </div>
        </div>
    );
};

export default Matchmaking;