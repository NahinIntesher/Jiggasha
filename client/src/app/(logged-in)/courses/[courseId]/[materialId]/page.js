"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  FaCaretDown,
  FaCaretUp,
  FaComment,
  FaEye,
  FaPlay,
} from "react-icons/fa6";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat } from "@/utils/Functions";
import { FaBook, FaCalendarAlt, FaCheck, FaVideo } from "react-icons/fa";
import SenderBox from "@/components/AI/SenderBox";
import ComprehensiveFormatter from "@/components/ui/ComprehensiveFormatter";
import Link from "next/link";

export default function SingleCourse() {
  const { courseId, materialId } = useParams();

  const [course, setCourse] = useState();
  const [currentMaterial, setCurrentMaterial] = useState();
  const [loading, setLoading] = useState(true);

  const [isReady, setIsReady] = useState(true);

  const [messages, setMessages] = useState([
    {
      self: false,
      content: "Hello, How can I help you?",
    },
  ]);

  const [formData, setFormData] = useState({
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData((prev) => ({ ...prev, coverImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isReady) return;
    setIsReady(false);

    let inputMessage = formData.message;

    setFormData((prev) => ({ ...prev, message: "" }));

    const newErrors = {};

    console.log("Form Data:", formData);

    // Validate fields
    // if (!validateName(formData.name)) newErrors.name = "Invalid name.";

    // if (Object.keys(newErrors).length > 0) {
    //     setErrors(newErrors);
    //     return;
    // }

    setMessages((prevMessages) => [
      {
        self: true,
        content: inputMessage,
      },
      ...prevMessages,
    ]);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("message", inputMessage);

      const response = await fetch("https://jiggasha.onrender.com/ai/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();

      console.log(result);

      // const result = JSON.parse(resultText);

      if (result.status === "Success") {
        setMessages((prevMessages) => [
          {
            self: false,
            content: result.response,
          },
          ...prevMessages,
        ]);

        setIsReady(true);
      } else {
        console.error("Error adding blog:", result);
      }
    } catch (error) {
      console.error("Error during blog creation:", error);
    }
  };

  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => (
      <div key={index} className={message.self ? "message self" : "message"}>
        <div className="content">
          <ComprehensiveFormatter rawContent={message.content} />
        </div>
      </div>
    ));
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jiggasha.onrender.com/courses/single/" + courseId,
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

        const foundMaterial = courseData.course_materials.find(
          (material) => material.material_id == materialId
        );
        setCurrentMaterial(foundMaterial);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <>Loading</>;
  } else {
    return (
      <>
        <HeaderAlt title={course.name + "'s Course"} />
        {loading ? (
          <div className="loading"></div>
        ) : (
          <div className="courseBoxContainer">
            <div className="scrollContainer">
              <div className="courseVideoBox">
                <video
                  src={"https://jiggasha.onrender.com/courses/material/"+course.course_id+"/"+currentMaterial.material_id}
                  controls
                  className="videoPlayer"
                />
                <div className="details">
                  <div className="iconContainer">
                    <FaPlay className="icon" />
                  </div>
                  <div className="contentDetails">
                    <div className="semiTitle">Video Lecture</div>
                    <div className="title">{currentMaterial.name}</div>
                  </div>
                </div>
              </div>
              <div className="courseContentsBox">
                <div className="title">Course Contents</div>
                <div className="courseContentBoxContainer">
                  {
                    course?.course_materials.map((material, index) => (
                      <MaterialBox
                        index={index}
                        courseId={course.course_id}
                        key={material.material_id}
                        material={material}
                        isActive={material.material_id == currentMaterial.material_id}
                      />
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="scrollContainer courseChatbotFlex">
              <div className="courseChatbox">
                <div className="title">Jiggasha AI</div>
                <div className="messageContainer">{renderedMessages}</div>
                <SenderBox
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  value={formData.message}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function CourseContentBox({ isActive }) {
  return (
    <div
      className={
        isActive
          ? "courseContentBox courseContentBoxActive"
          : "courseContentBox"
      }
    >
      <div className="iconContainer">
        <FaPlay className="icon" />
      </div>
      <div className="contentDetails">
        <div className="semiTitle">Video Lecture</div>
        <div className="title">Introduction to the Course</div>
      </div>
    </div>
  );
}

function MaterialBox({ material, courseId, index, isActive}) {
  return (
    <Link href={"/courses/"+courseId+"/"+material.material_id} className={`courseContentBox ${isActive ? "bg-gray-200" : ""}`} replace>
      <div
        className={`flex items-center justify-center w-12 h-12 mx-1 ml-3 rounded-full ${material.is_completed ? "bg-green-500" : "bg-gray-200"
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
            Lecture {index+1}{isActive ? <span className="font-bold"><span className="mx-2">•</span>Now Playing</span> : ""}
          </div>
          <div className="title">
            {material.name ? material.name : "Untitled"}
          </div>
        </div>

        {/* <div className="text-xs text-gray-500">
          Uploaded at: {new Date(material.created_at).toLocaleString()}
        </div> */}
      </div>
    </Link>
  );
}


// File: app/courses/[courseId]/page.js

// import { cookies } from "next/headers";
// import SingleCourse from "@/components/Courses/SingleCourse";

// export default async function SingleCoursePage({ params }) {
//   const { courseId } = params;

//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore.get("userRegistered");
//   const cookieValue = cookieHeader
//     ? `userRegistered=${cookieHeader.value}`
//     : "";

//   // Fetch course info
//   const courseRes = await fetch(
//     `https://jiggasha.onrender.com/courses/single/${courseId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         cookie: cookieValue,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!courseRes.ok) {
//     throw new Error("Failed to fetch course data");
//   }

//   const course = await courseRes.json();

//   return <SingleCourse course={course} />;
// }
