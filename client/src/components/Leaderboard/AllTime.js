"use client";

import { useEffect, useState } from "react";

import Loading from "../ui/Loading";
import { FaStar } from "react-icons/fa6";


export default function AllTime() {
    const [leaderboard, setLeaderboard] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/leaderboard", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const leaderboardData = await response.json();
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="leaderboardContainer">
                    {leaderboard.map((user, i) => (
                        <div className="leaderboardUserCard" key={i}>
                            <div className="userDetails">
                                <div className="rank">{i+1}</div>
                                <div className="profilePicture">
                                    {user.user_picture_url ? (
                                        <img src={user_picture_url} />
                                    ) : (
                                        <div className="psudoProfilePicture">{user.full_name[0]}</div>
                                    )}
                                </div>
                                <div className="nameContainer">
                                    <div className="name">{user.full_name}</div>
                                    <div className="level">Level {user.level}</div>
                                </div>
                            </div>
                            <div className="userRating">
                                <div className="title">Rating</div>
                                <div className="ratingValue">
                                    <FaStar className="ratingIcon" />
                                    <div className="ratingValueNumber">{user.user_rating}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
