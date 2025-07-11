"use client";

import { useState } from "react";
import BrowseCourses from "./BrowseCourses";
import EnrolledCourses from "./EnrolledCourses";
import Header from "../ui/Header";
import NotFoundPage from "../ui/NotFound";

export default function CourseTabs({ allCourses, enrolledCourses }) {
  const [activeTab, setActiveTab] = useState("enrolledCourses");

  return (
    <div>
      <Header title="Courses" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("enrolledCourses")}
          className={activeTab === "enrolledCourses" ? "tab tabActive" : "tab"}
          id="enrolledCourses"
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
      {activeTab === "enrolledCourses" &&
        (enrolledCourses.length === 0 ? (
          <NotFoundPage type="course" />
        ) : (
          <EnrolledCourses coursesData={enrolledCourses} />
        ))}
    </div>
  );
}
