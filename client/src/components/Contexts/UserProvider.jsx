"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    if (user) return user;

    setLoading(true);
    try {
      const response = await fetch("https://jiggasha.onrender.com/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("https://jiggasha.onrender.com/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "Success") {
        setUser(null);
        return true;
      } else {
        throw new Error(result.Error || "Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.message);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUser,
        logout,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
