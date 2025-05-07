"use client";

import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-50">
                <p className="text-lg text-gray-700">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-50">
                <p className="text-lg text-red-500">Failed to load user info.</p>
            </div>
        );
    }

    return (
        <div>
            <Header title="Dashboard" subtitle="Welcome to your dashboard" />
            <div className="flex justify-center items-center h-full">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mt-10">
                    <div className="flex flex-col items-center">
                        {user.user_picture ? (
                            <img
                                src={user.user_picture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover mb-4"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-gray-600">
                                    {user.full_name?.[0] || "U"}
                                </span>
                            </div>
                        )}
                        <h2 className="text-2xl font-semibold mb-2">{user.full_name}</h2>
                        <p className="text-gray-600 mb-4">{user.username}</p>
                        <p className="text-gray-500 text-sm mb-2">Email: {user.email}</p>
                        <p className="text-gray-500 text-sm mb-2">
                            Mobile: {user.mobile_no || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Role: {user.user_role}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Class Level: {user.user_class_level || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Group: {user.user_group || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Department: {user.user_department || "N/A"}
                        </p>
                        <p className="text-yellow-500 font-bold mt-2">
                            Rating: {user.user_rating || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}