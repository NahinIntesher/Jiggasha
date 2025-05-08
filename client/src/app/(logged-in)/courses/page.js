"use client";

import Header from "@/components/ui/Header";
import { use, useState } from "react";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FaFilter, FaList, FaGrip, FaPen } from "react-icons/fa6";
export default function Course() {
  const [activeTab, setActiveTab] = useState("enrolledCourses");

  return (
    <div className="">
      <Header title="Courses" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("enrolledCourses")}
          className={activeTab == "enrolledCourses" ? "tab tabActive" : "tab"}
        >
          Enrolled Courses
        </div>
        <div
          onClick={() => setActiveTab("browseCourses")}
          className={activeTab == "browseCourses" ? "tab tabActive" : "tab"}
        >
          Browse Courses
        </div>
      </div>

      <div className="filterContainer">
        <FaArrowUpWideShort className="filterIcon" />
        <div className="filterTitle">Filter</div>
      </div>
    </div>
  );
}
