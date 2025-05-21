"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { classLevel, group, department, subject, subjectName } from "@/utils/Constant";
import { FaCross, FaImages, FaXmark } from "react-icons/fa6";

export default function NewBlog() {
    const router = useRouter();

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        coverImage: null,
        classLevel: "6",
        group: "all",
        subject: 101,
        title: "",
        content: ""
    });

    function deleteImage(e) {
        e.stopPropagation();
        e.preventDefault();

        setFormData((prev) => ({
            ...prev,
            coverImage: null
        }));
    }

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
                        <select name="classLevel" value={formData.classLevel} onChange={handleChange}>
                            {classLevel.map((level) => (
                                <option key={level} value={level}>
                                    {level == "admission" ? "Admission" : level == "undergraduate" ? "Undergraduate" : `Class ${level}`}
                                </option>
                            ))}
                        </select>

                    </label>
                    {
                        (formData.classLevel == "9-10" || formData.classLevel == "11-12" || formData.classLevel == "admission") ?
                            <label>
                                <div className="name">Group</div>
                                <select name="group" value={formData.group} onChange={handleChange}>
                                    <option value="all">All Group</option>
                                    {group.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>

                            </label>
                            :
                            formData.classLevel == "undergraduate" ?
                                <label>
                                    <div className="name">Department</div>
                                    <select name="group" value={formData.group} onChange={handleChange}>
                                        <option value="all">All Department</option>
                                        {department.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>

                                </label>
                                :
                                <></>
                    }
                    {
                        (formData.classLevel == "9-10" || formData.classLevel == "11-12" || formData.classLevel == "admission" || formData.classLevel == "undergraduate") ?
                            formData.group != "" && <label>
                                <div className="name">Subject</div>
                                <select name="subject" value={formData.subject} onChange={handleChange}>
                                    {subject[formData.classLevel][formData.group].map((level) => (
                                        <option key={level} value={level}>
                                            {subjectName[level]}
                                        </option>
                                    ))}
                                </select>

                            </label>
                            :
                            (formData.classLevel != "") ?
                                <label>
                                    <div className="name">Subject</div>
                                    <select name="subject" value={formData.subject} onChange={handleChange}>

                                        {subject[formData.classLevel].map((level) => (
                                            <option key={level} value={level}>
                                                {subjectName[level]}
                                            </option>
                                        ))}
                                    </select>

                                </label>
                                :
                                <></>
                    }

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
                    <div className="uploadContainer">
                        {formData.coverImage ?
                            <div className="preview">
                                <img
                                    src={URL.createObjectURL(formData.coverImage)}
                                    alt="Preview"
                                    className="previewImage"
                                />
                                <div className="delete" onClick={deleteImage}><FaXmark/></div>
                            </div>
                            :
                            <div className="upload">
                                <FaImages className="icon" />
                                <div className="title">Upload Cover Image</div>
                                <div className="semiTitle">Drop Image Here or Upload File</div>
                                <input
                                    type="file"
                                    name="coverImage"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                            </div>

                        }
                    </div>
                </label>
                <button className="submit" type="submit">Create Blog</button>
            </form>
        </>
    );
}