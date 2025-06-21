"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaCalendarAlt,
  FaImage,
  FaVideo,
  FaMusic,
  FaFile,
  FaChevronDown,
  FaTimes,
  FaEye,
  FaComment,
  FaThumbsUp,
  FaShare,
  FaFlag,
  FaFilePdf,
} from "react-icons/fa";
import { X, Music, Video, File, Image, FileText, Archive } from "lucide-react";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat, hexToUrl } from "@/utils/Functions";
import {
  FaAngleDown,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaRegThumbsUp,
  FaUser,
  FaUserGroup,
} from "react-icons/fa6";
import NotFound from "@/components/ui/NotFound";
import Link from "next/link";

export default function SingleCommunity() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunityData();
    fetchPosts();
  }, [communityId]);

  const fetchCommunityData = () => {
    fetch("http://localhost:8000/communities/single/" + communityId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error("Community error:", err));
  };

  const fetchPosts = () => {
    fetch("http://localhost:8000/communities/allPosts/" + communityId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .catch((err) => console.error("Posts error:", err))
      .finally(() => setLoading(false));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("community_id", communityId);
      formData.append("content", postContent);

      // Append files to FormData
      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      console.log("Creating post for community:", formData);

      const response = await fetch(
        "http://localhost:8000/communities/newPost",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // console.log("Post created:", data);
        setNewPost("");
        setSelectedFiles([]);
        fetchPosts();
      } else {
        console.error("Failed to create post:", data.error);
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const handleReport = () => {
    alert("Report feature is not implemented yet.");
  };

  const getMediaDuration = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        const media = document.createElement(
          file.type.startsWith("audio/") ? "audio" : "video"
        );
        media.preload = "metadata";
        media.onloadedmetadata = () => {
          const duration = Math.floor(media.duration);
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        };
        media.src = URL.createObjectURL(file);
      } else {
        resolve(null);
      }
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );

  return (
    <>
      <HeaderAlt title={community?.name} />

      <div className="communityBox">
        {community?.cover_image_url ? (
          <img
            className="previewImage"
            src={community.cover_image_url}
            alt="Community Cover"
          />
        ) : (
          <div className="psudoPreviewImage">
            <FaUserGroup />
          </div>
        )}
        <div className="detailsContainer">
          <div className="details">
            <div className="titleContainer">
              <div className="title">{community?.name}</div>
              <div className="tags">
                {community?.subject && (
                  <div className="orangeTag">
                    {subjectName[community.subject]}
                  </div>
                )}
                <div className="grayTag">
                  {classLevelName(community?.class_level)}
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="informationContainer">
            <div className="informations">
              <div className="information">
                <FaCalendarAlt className="icon" />
                <div className="text">{dateFormat(community?.created_at)}</div>
              </div>
              <div className="information">
                <FaUser className="icon" />
                <div className="text">
                  {community?.total_members || 0} members
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="informationContainer">
            <div className="author">
              <div className="profilePicture">
                {community?.admin_picture ? (
                  <img src={community.admin_picture} alt="Admin" />
                ) : (
                  <div className="psudoProfilePicture">
                    {community?.admin_name?.[0]}
                  </div>
                )}
              </div>
              <div className="nameContainer">
                <div className="createdBy">Created By</div>
                <div className="name">{community?.admin_name}</div>
              </div>
            </div>
          </div>

          <hr />

          <div className="content">
            <p>{community?.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      {/* Give Post Box */}
      <div className="givePostBox">
        <div className="profilePicture">
          {community?.admin_picture ? (
            <img src={community.admin_picture} alt="Admin" />
          ) : (
            <div className="psudoProfilePicture">
              {community?.admin_name?.[0]}
            </div>
          )}
        </div>

        <div className="textBox">
          <div className="textareaContainer">
            <textarea
              value={postContent}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              {selectedFiles.map((file, index) => {
                const getFileIcon = (fileType) => {
                  if (fileType.startsWith("image/")) return Image;
                  if (fileType.startsWith("audio/")) return Music;
                  if (fileType.startsWith("video/")) return Video;
                  if (fileType.includes("pdf")) return FileText;
                  return File;
                };

                const getColors = (fileType) => {
                  if (fileType.startsWith("image/"))
                    return {
                      icon: "text-emerald-500",
                      bg: "from-emerald-50 to-emerald-100",
                    };
                  if (fileType.startsWith("audio/"))
                    return {
                      icon: "text-purple-500",
                      bg: "from-purple-50 to-purple-100",
                    };
                  if (fileType.startsWith("video/"))
                    return {
                      icon: "text-blue-500",
                      bg: "from-blue-50 to-blue-100",
                    };
                  if (fileType.includes("pdf"))
                    return {
                      icon: "text-red-500",
                      bg: "from-red-50 to-red-100",
                    };
                  return {
                    icon: "text-gray-500",
                    bg: "from-gray-50 to-gray-100",
                  };
                };

                const FileIcon = getFileIcon(file.type);
                const colors = getColors(file.type);

                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 z-10 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Image preview */}
                    {file.type.startsWith("image/") && (
                      <div className="aspect-square relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Non-image files */}
                    {!file.type.startsWith("image/") && (
                      <div
                        className={`aspect-square flex flex-col items-center justify-center bg-gradient-to-br ${colors.bg} p-3`}
                      >
                        <FileIcon className={`w-8 h-8 ${colors.icon} mb-2`} />
                        <div className="text-xs text-gray-600 text-center font-medium truncate w-full">
                          {file.name}
                        </div>
                      </div>
                    )}

                    {/* Image file name overlay */}
                    {file.type.startsWith("image/") && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <div className="text-white text-xs font-medium truncate">
                          {file.name}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="buttonContainer">
            <div className="attachButtons">
              <div className="attachButton">
                <FaImage className="icon" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </div>
              <div className="attachButton">
                <FaMicrophone className="icon" />
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </div>
              <div className="attachButton">
                <FaPaperclip className="icon" />
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,video/*"
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <button
              type="submit"
              className="sendButton"
              onClick={handlePostSubmit}
              disabled={isSubmitting || !postContent.trim()}
            >
              <FaPaperPlane className="icon" />
              <div className="text">{isSubmitting ? "Posting..." : "Post"}</div>
            </button>
          </div>
        </div>
      </div>

      <div className="miniBreak" />

      {/* Posts List */}
      <div className="postBoxContainer">
        {posts.length === 0 ? (
          <NotFound
            title={"No Posts Yet"}
            description={
              "This community is just getting started. Be the first to share something!"
            }
          />
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="postBox">
              <div className="reportButton" onClick={handleReport}>
                <FaFlag className="icon" />
                <span className="text">Report</span>
              </div>

              <div className="profile">
                <div className="profilePicture">
                  {post.author_picture ? (
                    <img src={post.author_picture} alt="Author" />
                  ) : (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50px",
                        border: "3px solid #ffffff",
                        backgroundColor: "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {post.author_name?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="profileDetail">
                  <div className="name">{post.author_name || "Anonymous"}</div>
                  <div className="detail">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="postContent">{post.content}</div>

              {post.media?.length > 0 && (
                <div className="p-5">
                  {post.media && post.media.length > 0 && (
                    <div className="">
                      {post.media.map((media, index) => {
                        const url = media.media_url;

                        const MediaContainer = ({ children }) => (
                          <div className="media-container my-4 rounded-xl overflow-hidden shadow border-2 border-orange-200 bg-orange-50">
                            {children}
                          </div>
                        );

                        if (!url) return null;

                        switch (media.media_type) {
                          case "image":
                            return (
                              <div key={media.media_id || index}>
                                <MediaContainer>
                                  <div className="relative pt-[56.25%]">
                                    <img
                                      src={url}
                                      alt="Post image"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/placeholder-image.jpg";
                                      }}
                                    />
                                  </div>
                                </MediaContainer>
                              </div>
                            );

                          case "audio":
                            return (
                              <div key={media.media_id || index}>
                                <MediaContainer>
                                  <div className="p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="bg-orange-100 p-2 rounded-full">
                                        <FaMusic className="text-orange-500" />
                                      </div>
                                      <span className="font-medium truncate text-orange-700">
                                        {media.filename || "Audio File"}
                                      </span>
                                    </div>
                                    <audio controls className="w-full">
                                      <source
                                        src={url}
                                        type={`audio/${url.split(".").pop()}`}
                                      />
                                      Your browser does not support the audio
                                      element.
                                    </audio>
                                  </div>
                                </MediaContainer>
                              </div>
                            );

                          case "video":
                            return (
                              <div key={media.media_id || index}>
                                <MediaContainer>
                                  <video
                                    controls
                                    className="w-full max-h-[500px] bg-black"
                                    poster={
                                      media.thumbnail_url ||
                                      "/video-thumbnail.jpg"
                                    }
                                  >
                                    <source
                                      src={url}
                                      type={`video/${url.split(".").pop()}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </MediaContainer>
                              </div>
                            );

                          case "document":
                            return (
                              <div key={media.media_id || index}>
                                <MediaContainer>
                                  <div className="p-4 flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                      <FaFilePdf className="text-red-500 text-2xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate text-orange-900">
                                        {media.filename || "Document"}
                                      </p>
                                      <p className="text-sm text-orange-600">
                                        {media.file_size
                                          ? `${(
                                              media.file_size /
                                              1024 /
                                              1024
                                            ).toFixed(2)} MB`
                                          : "Unknown size"}
                                      </p>
                                    </div>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-orange-600 hover:underline font-semibold"
                                      download
                                    >
                                      Download
                                    </a>
                                  </div>
                                </MediaContainer>
                              </div>
                            );

                          default:
                            return (
                              <div key={media.media_id || index}>
                                <MediaContainer>
                                  <div className="p-4 text-center text-orange-600 font-medium">
                                    Unsupported media type: {media.media_type}
                                  </div>
                                </MediaContainer>
                              </div>
                            );
                        }
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="postDetails">
                <span className="detail">{post.reaction_count} reactions</span>
                <span className="divider"></span>
                <span className="detail">{post.comment_count} comments</span>
              </div>

              <div className="postActionBoxContainer">
                {post.is_reacted ? (
                  <div className="postActionBox bg-orange-100">
                    <FaThumbsUp className="icon" />
                    <span className="text">Liked</span>
                  </div>
                ) : (
                  <div className="postActionBox">
                    <FaRegThumbsUp className="icon " />
                    <span className="text">Like</span>
                  </div>
                )}
                <Link
                  href={`/communities/${communityId}/${post.post_id}`}
                  className="postActionBox"
                >
                  <FaComment className="icon" />
                  <span className="text">Comments</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
