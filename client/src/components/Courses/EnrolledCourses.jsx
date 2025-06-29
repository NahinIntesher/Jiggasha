"use client";

import CourseCard from "@/components/Courses/CourseCard";
import {
  classLevel,
  group,
  department,
  subject,
  subjectName,
} from "@/utils/Constant";
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaList,
  FaArrowUpWideShort,
  FaGrip,
} from "react-icons/fa6";
import Loading from "../ui/Loading";

export default function EnrolledCourses({ coursesData }) {
  const [view, setView] = useState("grid");

  const courses = Array.isArray(coursesData) ? coursesData : [];

  const [loading, setLoading] = useState(true);
  const [sortMenu, setSortMenu] = useState(false);

  const [sorting, setSorting] = useState({
    classLevel: "",
    group: "",
    subject: "",
    sortBy: "",
  });

  function toggleSortMenu() {
    console.log("sortMenu", sortMenu);
    setSortMenu((prev) => !prev);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "classLevel") {
      setSorting((prev) => ({
        ...prev,
        classLevel: value,
        group: "",
        subject: "",
      }));
    } else if (name == "group") {
      setSorting((prev) => ({
        ...prev,
        group: value,
        subject: "",
      }));
    } else {
      setSorting((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // console.log("coursesData", coursesData);
    setLoading(false);
  }, [coursesData]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <div className="filterContainer">
          <div className="filters">
            <div className="filterButton" onClick={toggleSortMenu}>
              <FaArrowUpWideShort className="icon" />
              <div className="title">Filter</div>
            </div>
            <div
              className={
                sortMenu
                  ? "selectMainContainer activeSelectMainContainer"
                  : "selectMainContainer"
              }
            >
              <div className="selectContainer">
                <select
                  name="classLevel"
                  value={sorting.classLevel}
                  onChange={handleChange}
                >
                  <option value="">All Class</option>
                  {classLevel.map((level) => (
                    <option key={level} value={level}>
                      {level == "admission"
                        ? "Admission"
                        : level == "undergraduate"
                        ? "Undergraduate"
                        : `Class ${level}`}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="downIcon" />
              </div>
              {sorting.classLevel == "9-10" ||
              sorting.classLevel == "11-12" ||
              sorting.classLevel == "admission" ? (
                <div className="selectContainer">
                  <select
                    name="group"
                    value={sorting.group}
                    onChange={handleChange}
                  >
                    <option value="">All Group</option>
                    {group.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              ) : sorting.classLevel == "undergraduate" ? (
                <div className="selectContainer">
                  <select
                    name="group"
                    value={sorting.group}
                    onChange={handleChange}
                  >
                    <option value="">All Department</option>
                    {department.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              ) : (
                <></>
              )}
              {sorting.classLevel == "9-10" ||
              sorting.classLevel == "11-12" ||
              sorting.classLevel == "admission" ||
              sorting.classLevel == "undergraduate" ? (
                sorting.group != "" && (
                  <div className="selectContainer">
                    <select
                      name="subject"
                      value={sorting.subject}
                      onChange={handleChange}
                    >
                      <option value="">All Subject</option>
                      {subject[sorting.classLevel][sorting.group].map(
                        (level) => (
                          <option key={level} value={level}>
                            {subjectName[level]}
                          </option>
                        )
                      )}
                    </select>
                    <FaAngleDown className="downIcon" />
                  </div>
                )
              ) : sorting.classLevel != "" ? (
                <div className="selectContainer">
                  <select
                    name="subject"
                    value={sorting.subject}
                    onChange={handleChange}
                  >
                    <option value="">All Subject</option>
                    {subject[sorting.classLevel].map((level) => (
                      <option key={level} value={level}>
                        {subjectName[level]}
                      </option>
                    ))}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              ) : (
                <></>
              )}
              <div className="selectContainer">
                <select
                  name="sortBy"
                  value={sorting.sortBy}
                  onChange={handleChange}
                >
                  <option value="highestView">Highest View</option>
                  <option value="mostLiked">Most Liked</option>
                  <option value="newest">Newest</option>
                </select>
                <FaAngleDown className="downIcon" />
              </div>
            </div>
          </div>
          <div className="views">
            <div
              className={view == "list" ? "viewIcon activeIcon" : "viewIcon"}
              onClick={() => {
                setView("list");
              }}
            >
              <FaList />
            </div>
            <div
              className={view == "grid" ? "viewIcon activeIcon" : "viewIcon"}
              onClick={() => {
                setView("grid");
              }}
            >
              <FaGrip />
            </div>
          </div>
        </div>

        <div className="cardContainer">
          {courses.map((course) => (
            <CourseCard
              key={course.course_id}
              id={course.course_id}
              name={course.name}
              classLevel={course.class_level}
              subject={course.subject}
              description={course.description}
              coverImage={course.cover_image_url}
              createdAt={course.created_at}
              instructorName={course.instructor_name}
              instructorPicture={course.instructor_picture_url}
              totalStudent={course.total_student}
              isJoined={course.is_joined}
              totalMaterial={course.total_material}
              view={view}
            />
          ))}
        </div>
      </>
    );
  }
}
