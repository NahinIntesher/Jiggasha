"use client";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Sidebar from "@/components/ui/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutProvider } from "@/components/Contexts/LayoutProvider";

export default function RootLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
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
      console.log(result);
      if (result.status === "Success") {
        router.push("/login");
      } else {
        alert(result.Error || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred, please try again later.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <LayoutProvider>
      <div className="mainContainer">
        {/* Sidebar */}
        <Sidebar user={user} handleLogout={handleLogout} />

        {/* Main Content */}
        <div className="contentContainer">
          {/* Chilldren */}
          {children}
        </div>
      </div>
    </LayoutProvider>
  );
}
