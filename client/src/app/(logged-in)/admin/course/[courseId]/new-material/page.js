"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import {
  FaImages,
  FaXmark,
  FaFile,
  FaVideo,
  FaMusic,
  FaFilePdf,
} from "react-icons/fa6";

export default function NewMaterial() {
  const { courseId } = useParams();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: courseId,
    materialName: "",
    materials: [],
  });

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (formData.materials.length === 0) {
      newErrors.materials = "At least one material file is required";
    }

    if (formData.materials.length > 5) {
      newErrors.materials = "Maximum 5 files allowed";
    }

    const oversizedFiles = formData.materials.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      newErrors.fileSize = `Files too large: ${oversizedFiles
        .map((f) => f.name)
        .join(", ")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, files } = e.target;

    if (name === "materials") {
      if (files) {
        const newFiles = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          materials: [...prev.materials, ...newFiles],
        }));
      }
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const deleteMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));

    if (formData.materials.length > 1 && errors.materials) {
      setErrors((prev) => ({ ...prev, materials: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setUploadProgress(0);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("courseId", formData.courseId);
      formDataToSend.append("materialName", formData.materialName);

      // Append each file individually - backend expects "files" field name
      formData.materials.forEach((file) => {
        formDataToSend.append("files", file);
      });

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await fetch(
        "http://localhost:8000/courses/material/add",
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include", // equivalent to withCredentials: true
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      setUploadProgress(100); // Set to 100% on response

      console.log("Upload completed with status:", response.status);

      if (response.ok) {
        let result = {};

        try {
          const text = await response.text();
          result = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // If JSON parsing fails but status is ok, assume success
          result = { status: "Success" };
        }

        if (
          result.status === "Success" ||
          response.status === 201 ||
          response.status === 200
        ) {
          alert("Material added successfully!");
          router.back();
        } else {
          setErrors({
            submit:
              result.message || "Upload completed but server returned an error",
          });
        }
      } else {
        // Handle HTTP error status
        let errorMessage = `Server error (${response.status})`;

        try {
          const errorText = await response.text();
          const errorResult = errorText ? JSON.parse(errorText) : {};
          errorMessage = errorResult.message || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }

        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (error.name === "AbortError") {
        setErrors({ submit: "Upload timed out. Please try again." });
      } else if (error.message.includes("fetch")) {
        setErrors({
          submit: "Network error during upload. Please check your connection.",
        });
      } else {
        setErrors({ submit: "Failed to upload. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    const iconStyle = { fontSize: "24px", marginRight: "8px" };
    if (fileType.startsWith("image/"))
      return <FaImages style={{ ...iconStyle, color: "#3b82f6" }} />;
    if (fileType.startsWith("video/"))
      return <FaVideo style={{ ...iconStyle, color: "#ef4444" }} />;
    if (fileType.startsWith("audio/"))
      return <FaMusic style={{ ...iconStyle, color: "#10b981" }} />;
    if (fileType === "application/pdf")
      return <FaFilePdf style={{ ...iconStyle, color: "#dc2626" }} />;
    return <FaFile style={{ ...iconStyle, color: "#6b7280" }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <HeaderAlt title="Adding New Material" />

      <form onSubmit={handleSubmit} className="formBox">
        {errors.submit && (
          <div className="bg-red-100 text-red-800 border border-red-300 p-3 rounded mb-4 text-sm">
            {errors.submit}
          </div>
        )}

        <label>
          <div className="name">Material Name</div>
          <input
            type="text"
            value={formData.materialName}
            onChange={(e) =>
              setFormData({ ...formData, materialName: e.target.value })
            }
            className="input"
            required
          />
        </label>

        <label>
          <div className="name">Upload Materials</div>

          {formData.materials.length > 0 && (
            <div className="uploadContainer mt-4">
              {errors.materials && (
                <div className="text-red-500 text-sm mb-1">
                  {errors.materials}
                </div>
              )}
              {errors.fileSize && (
                <div className="text-red-500 text-sm mb-1">
                  {errors.fileSize}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.materials.map((file, index) => {
                  const type = file.type;
                  return (
                    <div
                      key={index}
                      className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getFileIcon(type)}
                          <div>
                            <div className="font-medium text-sm text-gray-800 truncate max-w-32">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteMaterial(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaXmark />
                        </button>
                      </div>

                      {type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                      )}
                      {type.startsWith("video/") && (
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-full h-32 rounded border"
                        />
                      )}
                      {type.startsWith("audio/") && (
                        <audio
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-full"
                        />
                      )}
                      {type === "application/pdf" && (
                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                          <div className="text-center">
                            <FaFilePdf className="text-red-600 text-2xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">
                              PDF Preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="uploadContainer">
            <div className="upload mt-6">
              <FaImages className="icon mb-1" />
              <div className="title font-medium">Upload Material</div>
              <div className="semiTitle text-sm text-gray-500">
                Drop files here or upload (Max 10MB per file)
              </div>
              <input
                type="file"
                name="materials"
                multiple
                onChange={handleChange}
                accept="*/*"
                className="mt-2"
                disabled={isLoading}
              />
            </div>
          </div>
        </label>

        <button
          className="submit mt-6"
          type="submit"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? `Uploading... ${uploadProgress}%` : "Add"}
        </button>
      </form>
    </>
  );
}
