"use client";
import React from "react";

export default function Home() {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      });

      console.log("Logging out...");

      const result = await response.json();
      console.log("Logout response:", result);

      if (result.status === "Success") {
        console.log("Logout successful, redirecting...");
        router.replace("/login");
      } else {
        alert(result.Error || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during logout:", error);
      alert("An error occurred, please try again later.");
    }
  };

  return (
    <div className="bg-purple-50 p-2 min-h-screen">
      <p>You Are Authenticated</p>
      <p>
        Table of contents: How do you choose a topic for a 1000 word essay? How
        long is 1000 words? A short guide on outlining Structuring your essay
        effectively: The introduction Crafting a 1000 word essay like a pro: The
        body Sum up the core points: A flawless conclusion What does 1000 words
        look like? Successful people are perfect time managers What can we do
        for you in terms of essay writing? How to Choose a Topic For a 1000 Word
        Essay? One of the main challenges for a student who wonders how to write
        a 1000-word essay is choosing a working topic. If your teacher has not
        provided instructions on writing a paper, you can select a topic by
        yourself. The criteria for choosing a topic are: The ability to find
        enough materials and sources on the topic. Your interest in the case.
        The relevance and actuality of the case. When selecting a topic,
        consider the type of essay (argumentative, narrative, explanatory, etc.)
      </p>

      <button
        onClick={handleLogout}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
}
