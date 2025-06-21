"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCaretDown,
  FaCaretUp,
  FaChalkboardUser,
  FaComment,
  FaEye,
  FaPlay,
} from "react-icons/fa6";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat } from "@/utils/Functions";
import { FaBook, FaCalendarAlt, FaUser } from "react-icons/fa";
import Link from "next/link";

export default function SingleCourse() {
  const { courseId } = useParams();

  const router = useRouter();

  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);

  const [totalVote, setTotalVote] = useState(null);
  const [votingStatus, setVotingStatus] = useState(null);

  const vote = async (e, vote) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("http://localhost:8000/courses/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          courseId: courseId,
          vote: vote,
        }),
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote(
          (prev) => parseInt(prev) + parseInt(vote) - parseInt(votingStatus)
        );
        setVotingStatus(vote);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unvote = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("http://localhost:8000/courses/unvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          courseId: courseId,
        }),
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote((prev) => parseInt(prev) - parseInt(votingStatus));
        setVotingStatus(0);
      } else {
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/courses/single/" + courseId,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const courseData = await response.json();
        setCourse(courseData);
        setTotalVote(courseData.vote_count);
        setVotingStatus(courseData.is_voted);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function goToMaterial() {
    if (course.is_joined) {
      router.push(`/courses/${course.course_id}/2rgvrwvwv`);
    } else {
      alert("You need to enroll in the course to access the materials.");
    }
  }

  if (loading) {
    return <>Loading</>;
  } else {
    return (
      <>
        <HeaderAlt title={course.instructor_name + "'s Course"} />
        {loading ? (
          <div className="loading"></div>
        ) : (
          <div className="courseBoxContainer">
            <div className="scrollContainer">
              <div className="courseBox">
                <div className="details">
                  <div className="titleContainer">
                    <div className="title">{course.name}</div>
                    <div className="tags">
                      <div className="orangeTag">
                        {subjectName[course.subject]}
                      </div>
                      <div className="grayTag">
                        {classLevelName(course.class_level)}
                      </div>
                    </div>
                  </div>
                  {course.is_joined ? (
                    <div className="enrollment enrolled">
                      <div className="enrollButton">Enrolled</div>
                    </div>
                  ) : (
                    <div className="enrollment">
                      <div className="enrollButton">Enroll Now</div>
                      {course.price == 0 ? (
                        <div className="free">Free</div>
                      ) : (
                        <div className="price">৳{course.price}</div>
                      )}
                    </div>
                  )}
                </div>
                {course.cover_image_url ? (
                  <img className="previewImage" src={course.cover_image_url} />
                ) : (
                  <div className="psudoPreviewImage">
                    <FaBook />
                  </div>
                )}
                <div className="informationContainer">
                  <div className="instructor">
                    <div className="profilePicture">
                      {course.instructor_picture_url ? (
                        <img src={course.instructor_picture_url} />
                      ) : (
                        <div className="psudoProfilePicture">
                          {course.instructor_name[0]}
                        </div>
                      )}
                    </div>
                    <div className="nameContainer">
                      <div className="createdBy">Created By</div>
                      <div className="name">{course.instructor_name}</div>
                    </div>
                  </div>
                  <div className="informations">
                    <div className="information">
                      <FaUser className="icon" />
                      <div className="text">
                        {course.total_student} Studnets
                      </div>
                    </div>
                    <div className="information">
                      <FaChalkboardUser className="icon" />
                      <div className="text">3 Lectures</div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="descriptionContainer">
                  <div className="title">About the Course</div>
                  <div className="description">{course.description}</div>
                </div>
              </div>
            </div>
            <div className="scrollContainer courseContentsBoxFlex">
              <div className="courseContentsBox">
                <div className="title">Course Contents</div>
                <div className="courseContentBoxContainer">
                  <CourseContentBox action={goToMaterial} />
                  <CourseContentBox action={goToMaterial} />
                  <CourseContentBox action={goToMaterial} />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function CourseContentBox({ action }) {
  return (
    <div onClick={action} className="courseContentBox">
      <div className="iconContainer">
        <FaPlay className="icon" />
      </div>
      <div className="contentDetails">
        <div className="semiTitle">Lecture 1</div>
        <div className="title">Introduction to the Course</div>
      </div>
    </div>
  );
}
