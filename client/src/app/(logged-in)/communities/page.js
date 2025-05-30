"use client";

import BrowseCommunities from "@/components/Communities//BrowseCommunities";
import MyCommunities from "@/components/Communities/MyCommunities";
import Header from "@/components/ui/Header";
import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function Communities() {
  const [activeTab, setActiveTab] = useState("browseCommunities");

  return (
    <>
      <Header title="Communities" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("myCommunities")}
          className={activeTab == "myCommunities" ? "tab tabActive" : "tab"}
        >
          My Communities
        </div>
        <div
          onClick={() => setActiveTab("browseCommunities")}
          className={activeTab == "browseCommunities" ? "tab tabActive" : "tab"}
        >
          Browse Communities
        </div>
      </div>

      {activeTab == "myCommunities" && <MyCommunities />}
      {activeTab == "browseCommunities" && <BrowseCommunities />}

      <Link href="/communities/new-community" className="newButton">
        <FaPlus className="icon" />
        <div className="text">New Community</div>
      </Link>
      <div className="bigSpacing"></div>
    </>
  );
}
