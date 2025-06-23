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
} from "react-icons/fa6";
import { subjectName, classLevelName } from "@/utils/Constant";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

// File type icons mapping
const fileTypeIcons = {
  pdf: <FaFilePdf className="icon" />,
  image: <FaFileImage className="icon" />,
  video: <FaFileVideo className="icon" />,
  audio: <FaFileAudio className="icon" />,
  default: <FaFilePdf className="icon" />,
};

export default function CourseDetails({ course }) {
  const router = useRouter();
  const courseData = course || {};
  const isJoined = courseData.is_joined || false;
  const materials = courseData.course_materials || [];

  function handleMaterialClick(materialId) {
    if (isJoined) {
      router.push(`/courses/material/${materialId}`);
    } else {
      alert("You need to enroll in the course to access the materials.");
    }
  }

  function getFileIcon(materialType) {
    return (
      fileTypeIcons[materialType.toLowerCase()] || fileTypeIcons["default"]
    );
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
                  {/* <div className="orangeTag">{subjectName[course.subject]}</div> */}
                  <div className="grayTag">{course.class_level}</div>
                </div>
              </div>
            </div>

            {course.cover_image_url ? (
              <img
                className="previewImage"
                src={course.cover_image_url}
                alt={`Cover for ${course.name}`}
              />
            ) : (
              <div className="psudoPreviewImage">
                <FaBook />
              </div>
            )}

            <div className="informationContainer">
              <div className="instructor">
                <div className="profilePicture">
                  {course.instructor_picture_url ? (
                    <img
                      src={course.instructor_picture_url}
                      alt={course.instructor_name}
                    />
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
                  <div className="text">{materials.length} Materials</div>
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
                materials.map((material) => (
                  <MaterialBox
                    key={material.material_id}
                    material={material}
                    onClick={() => handleMaterialClick(material.material_id)}
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

        {/* Only show "New Material" button for admin/instructor */}
        {isJoined && (
          <Link
            href={`/admin/course/${course.course_id}/new-material`}
            className="newButton"
          >
            <FaPlus className="icon" />
            <div className="text">New Material</div>
          </Link>
        )}
      </div>
    </>
  );
}

function MaterialBox({ material, onClick, icon }) {
  return (
    <div onClick={onClick} className="courseContentBox">
      <div className="iconContainer">{icon}</div>
      <div className="contentDetails">
        <div className="semiTitle">{material.type.toUpperCase()}</div>
        <div className="title">{material.name}</div>
        <div className="metaInfo">
          {new Date(material.created_at).toLocaleDateString()} •
          {material.size > 0 ? ` ${Math.round(material.size / 1024)}KB` : ""}
        </div>
      </div>
    </div>
  );
}
