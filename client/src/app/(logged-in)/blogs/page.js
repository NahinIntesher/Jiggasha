"use client";

import BrowseBlogs from "@/components/Blogs/BrowseBlogs";
import MyBlogs from "@/components/Blogs/MyBlogs";
import Header from "@/components/ui/Header";
import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function Blogs() {
  const [activeTab, setActiveTab] = useState("browseBlogs");

  return (
    <>
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

      { activeTab == "myBlogs" && <MyBlogs /> }
      { activeTab == "browseBlogs" && <BrowseBlogs /> }

      <Link href="/blogs/new-blog" className="newButton">
        <FaPlus className="icon" />
        <div className="text">New Blog</div>
      </Link>
      <div className="bigSpacing"></div>
    </>
  );
}
