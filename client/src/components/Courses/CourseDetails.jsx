"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaVideo } from "react-icons/fa";
import {
  FaBook,
  FaUser,
  FaChalkboardUser,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaPlay,
  FaCheck,
  FaFile,
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

  function goToMaterial(materialId) {
    if (isJoined) {
      router.push(`/courses/${course.course_id}/${materialId}`);
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
                  <Link href="https://sandbox.payment.bkash.com/" className="enrollButton">Enroll Now</Link>
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
                <div className="flex flex-col items-center justify-center py-16 px-8">
                  {/* Icon Container with Orange Gradient Background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-20 scale-110"></div>
                    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-full shadow-lg">
                      <FaFile className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="text-center max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      No Materials Available
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Sorry!, Currently no material available for this course.
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-orange-100 to-gray-100 rounded-full opacity-60 blur-sm"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-orange-100 rounded-full opacity-40 blur-sm"></div>
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
    <div onClick={() => { action(material.material_id) }} className="courseContentBox">
      <div
        className={`flex items-center justify-center w-12 h-12 mx-1 rounded-full ${material.is_completed ? "bg-green-500" : "bg-gray-200"
          }`}
      >
        {material.is_completed ? (
          <FaCheck className="text-white text-xl" />
        ) : (
          <FaVideo className="text-gray-400 text-xl" />
        )}
      </div>

      <div className="contentDetails">
        <div className="contentDetails">
          <div className="semiTitle">
            Lecture {index + 1}
          </div>
          <div className="title">
            {material.name ? material.name : "Untitled"}
          </div>
        </div>

        {/* <div className="text-xs text-gray-500">
          Uploaded at: {new Date(material.created_at).toLocaleString()}
        </div> */}
      </div>
    </div >
  );
}
