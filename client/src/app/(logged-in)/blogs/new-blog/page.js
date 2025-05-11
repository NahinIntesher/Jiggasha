"use client";

import Header from "@/components/ui/Header";
import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlog() {
    const router = useRouter();

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        coverImage: null,
        classLevel: "",
        title: "",
        content: "",
        subject: "",
    });

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

        console.log("Form data:", formData);
        const newErrors = {};
        // Validate fields
        // if (!validateName(formData.name)) newErrors.name = "Invalid name.";

        // if (Object.keys(newErrors).length > 0) {
        //     setErrors(newErrors);
        //     return;
        // }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("coverImage", formData.coverImage);
            formDataToSend.append("classLevel", formData.classLevel);
            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", formData.content);
            formDataToSend.append("subject", formData.subject);

            const response = await fetch("http://localhost:8000/blogs/add", {
                method: "POST",
                body: formDataToSend,
                credentials: "include",
            });

            const result = await response.json();

            // const result = JSON.parse(resultText);

            if (result.status === "Success") {
                alert("Blog added!");
                router.back();
            } else {
                console.error("Error adding blog:", result);
            }
        } catch (error) {
            console.error("Error during blog creation:", error);
            setErrors("An error occurred, please try again later.");
        }
    };

    return (
        <>
            <HeaderAlt title="New Blog" />
            <form onSubmit={handleSubmit} className="formBox">
                <div className="title">Create New Blog</div>
                <label>
                    <div className="name">Blog Title</div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter Blog Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className="multipleLabel">
                    <label>
                        <div className="name">Class</div>
                        <select value={formData.classLevel} onChange={handleChange} name="classLevel" required>
                            <option value="" disabled>Select Class</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9-10">Class 9-10</option>
                            <option value="11-12">Class 10-11</option>
                            <option value="admission">Admission</option>
                            <option value="undergraduate">Undergraduate</option>
                        </select>
                    </label>
                    <label>
                        <div className="name">Group</div>
                        <select name="group" defaultValue="" required>
                            <option value="" disabled>Select Group</option>
                            <option value="6">Science</option>
                            <option value="7">Commerce</option>
                            <option value="8">Arts</option>
                        </select>
                    </label>
                    <label>
                        <div className="name">Subject</div>
                        <select value={formData.subject} onChange={handleChange} name="subject" required>
                            <option value="" disabled>Select Subject</option>
                            <option value="Bangla">Bangla</option>
                            <option value="English">English</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Higher Mathematics">Higher Mathematics</option>
                            <option value="Agricultural Education">Agricultural Education</option>
                        </select>
                    </label>
                </div>
                <label>
                    <div className="name">Content</div>
                    <textarea
                        type="text"
                        name="content"
                        placeholder="Enter Blog Content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <div className="name">Cover Image</div>
                    <input
                        type="file"
                        name="coverImage"
                        onChange={handleChange}
                        accept="image/*"    
                    />
                </label>
                <button className="submit" type="submit">Create Blog</button>
            </form>
        </>
    );
}