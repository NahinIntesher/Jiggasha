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
import { FaBook, FaCalendarAlt } from "react-icons/fa";
import SenderBox from "@/components/AI/SenderBox";
import ComprehensiveFormatter from "@/components/ui/ComprehensiveFormatter";

export default function SingleCourse({ course }) {
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
                  src="http://localhost:3000/images/demo.mp4"
                  controls
                  className="videoPlayer"
                />
                <div className="details">
                  <div className="iconContainer">
                    <FaPlay className="icon" />
                  </div>
                  <div className="contentDetails">
                    <div className="semiTitle">Lecture 1</div>
                    <div className="title">Introduction to the Course</div>
                  </div>
                </div>
              </div>
              <div className="courseContentsBox">
                <div className="title">Course Contents</div>
                <div className="courseContentBoxContainer">
                  <CourseContentBox isActive={true} />
                  <CourseContentBox isActive={false} />
                  <CourseContentBox isActive={false} />
                </div>
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
        <div className="semiTitle">Lecture 1</div>
        <div className="title">Introduction to the Course</div>
      </div>
    </div>
  );
}
