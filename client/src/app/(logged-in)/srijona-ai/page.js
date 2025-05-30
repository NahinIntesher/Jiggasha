"use client";

import Header from "@/components/ui/Header";
import { useEffect, useMemo, useState } from "react";
import { FaImage, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import "katex/dist/katex.min.css";
import ComprehensiveFormatter from "@/components/ui/ComprehensiveFormatter";
import SenderBox from "@/components/AI/SenderBox";

export default function SrijonaAI() {
  const [errors, setErrors] = useState({});

  const [isReady, setIsReady] = useState(false);

  const [messages, setMessages] = useState([]);

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

      const response = await fetch("http://localhost:8000/ai/response", {
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
        const response = await fetch("http://localhost:8000/ai/messages", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsReady(true);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <Header title="Srijona AI" />
      <div className="messageContainer">{renderedMessages}</div>
      <SenderBox
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        value={formData.message}
      />
    </div>
  );
}
