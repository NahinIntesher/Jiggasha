"use client";

import Header from "@/components/ui/Header";
import { use, useState } from "react";
import { FaArrowUpWideShort } from "react-icons/fa6";

export default function Blogs() {
  const [activeTab, setActiveTab] = useState("browseBlogs");

  return (
    <div className="">
      <Header title="Blogs" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("myBlogs")}
          className={activeTab == "myBlogs" ? "tab tabActive" : "tab"}
        >
          My Blogs
        </div>
        <div
          onClick={() => setActiveTab("browseBlogs")}
          className={activeTab == "browseBlogs" ? "tab tabActive" : "tab"}
        >
          Browse Blogs
        </div>
      </div>

      <div className="filterContainer">
        <FaArrowUpWideShort className="filterIcon" />
        <div className="filterTitle">Filter</div>
      </div>
    </div>
  );
}
