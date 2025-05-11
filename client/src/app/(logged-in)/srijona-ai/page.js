"use client";

import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";
import { FaImage, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import 'katex/dist/katex.min.css';
import ComprehensiveFormatter from "@/components/ui/ComprehensiveFormatter";

export default function SrijonaAI() {
  const [errors, setErrors] = useState({});

  const [isReady, setIsReady] = useState(false);

  const [messages, setMessages] = useState([]);

  const [formData, setFormData] = useState({
    message: ""
  });

  const preprocessGeminiResponse = (text) => {
    let processed = text;
    
    // Fix missing language identifier in code blocks
    processed = processed.replace(/```(\s*\n)/g, '```text\n');
    
    // Ensure code blocks are properly closed
    const openCodeBlocks = (processed.match(/```/g) || []).length;
    if (openCodeBlocks % 2 !== 0) {
      processed += '\n```';
    }
    
    // Fix escaped characters
    processed = processed.replace(/\\`/g, '`');
    
    return processed;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isReady) return;
    setIsReady(false);

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
        content: formData.message
      },
      ...prevMessages
    ]);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("message", formData.message);

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
            content: result.response
          },
          ...prevMessages
        ]);
    
        setIsReady(true);
        setFormData({
          message: ""
        });
      } else {
        console.error("Error adding blog:", result);
      }
    } catch (error) {
      console.error("Error during blog creation:", error);
    }
  };

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
      <div className="messageContainer">
        {messages.map((message, index) => (
          <div key={index} className={message.self ? "message self" : "message"}>
            <div className="content">
            <ComprehensiveFormatter rawContent={message.content} />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="messageSendBox">
        <textarea
          type="text"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Type your message here..."
        />
        <div className="buttonContainer">
          <div className="attachButtons">
            <div className="attachButton">
              <FaImage className="icon" />
            </div>
            <div className="attachButton">
              <FaMicrophone className="icon" />
            </div>
            <div className="attachButton">
              <FaPaperclip className="icon" />
            </div>
          </div>
          <button type="submit" className="sendButton">
            <FaPaperPlane className="icon" />
            <div className="text">Send</div>
          </button>
        </div>
      </form>
    </div>
  );
}
