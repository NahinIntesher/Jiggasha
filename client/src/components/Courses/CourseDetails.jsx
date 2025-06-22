"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import { FaBook, FaUser, FaChalkboardUser, FaPlay } from "react-icons/fa6";
import { subjectName, classLevelName } from "@/utils/Constant";

export default function CourseDetails({ course }) {
  const router = useRouter();
  const courseData = course || {};
  const isJoined = courseData.is_joined || false;

  function goToMaterial() {
    if (isJoined) {
      router.push(`/courses/${course.course_id}/2rgvrwvwv`);
    } else {
      alert("You need to enroll in the course to access the materials.");
    }
  }

  return (
    <>
      <HeaderAlt title={`${course.instructor_name}'s Course`} />
      <div className="courseBoxContainer">
        <div className="scrollContainer">
          <div className="courseBox">
            <div className="details">
              <div className="titleContainer">
                <div className="title">{course.name}</div>
                <div className="tags">
                  {/* <div className="orangeTag">{subjectName[course.subject]}</div>
                  <div className="grayTag">
                    {classLevelName(course.class_level)}
                  </div> */}
                </div>
              </div>
              {isJoined ? (
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
                  <div className="text">{course.total_student} Students</div>
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
    </>
  );
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
