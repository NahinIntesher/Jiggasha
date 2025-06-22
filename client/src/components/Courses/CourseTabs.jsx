"use client";

import { useState } from "react";
import BrowseCourses from "./BrowseCourses";
import EnrolledCourses from "./EnrolledCourses";
import Header from "../ui/Header";

export default function CourseTabs({ allCourses, enrolledCourses }) {
  const [activeTab, setActiveTab] = useState("browseCourses");

  return (
    <div>
      <Header title="Courses" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("enrolledCourses")}
          className={activeTab === "enrolledCourses" ? "tab tabActive" : "tab"}
        >
          Enrolled Courses
        </div>
        <div
          onClick={() => setActiveTab("browseCourses")}
          className={activeTab === "browseCourses" ? "tab tabActive" : "tab"}
        >
          Browse Courses
        </div>
      </div>

      {activeTab === "browseCourses" && (
        <BrowseCourses coursesData={allCourses} />
      )}
      {activeTab === "enrolledCourses" && (
        <EnrolledCourses coursesData={enrolledCourses} />
      )}
    </div>
  );
}
