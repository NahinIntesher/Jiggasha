"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import {
  FaBook,
  FaUser,
  FaChalkboardUser,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaPlay,
} from "react-icons/fa6";

export default function CourseDetails({ course }) {
  const router = useRouter();
  const courseData = course || {};
  const isJoined = courseData.is_joined || false;
  const materials = courseData.course_materials || [];

  function getFileIcon(materialType) {
    return (
      fileTypeIcons[materialType.toLowerCase()] || fileTypeIcons["default"]
    );
  }

  const fileTypeIcons = {
    pdf: <FaFilePdf className="icon" />,
    image: <FaFileImage className="icon" />,
    video: <FaFileVideo className="icon" />,
    audio: <FaFileAudio className="icon" />,
    default: <FaFilePdf className="icon" />,
  };

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
            <div className="title">Course Materials</div>
            <div className="courseContentBoxContainer">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <MaterialBox
                    index={index}
                    action={goToMaterial}
                    key={material.material_id}
                    material={material}
                    icon={getFileIcon(material.type)}
                  />
                ))
              ) : (
                <div className="emptyMaterials">
                  No materials available for this course yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MaterialBox({ material, action, icon, index }) {
  return (
    <div onClick={action} className="courseContentBox cursor-default">
      <div className="iconContainer">{icon}</div>
      <div className="contentDetails">
        <div className="contentDetails">
          <div className="semiTitle">
            Lecture {index + 1} ({material.type})
          </div>
          <div className="title">
            {material.name ? material.name : "Untitled"}
          </div>
        </div>

        {/* <div className="text-xs text-gray-500">
          Uploaded at: {new Date(material.created_at).toLocaleString()}
        </div> */}
      </div>
    </div>
  );
}
