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
import Loading from "@/components/ui/Loading";
import PostBox from "@/components/Communities/PostBox";

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
  const [isReacted, setIsReacted] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);
  const [updatePost, setUpdatePost] = useState(0);

  useEffect(() => {
    fetchCommunityData();
    fetchPosts();
  }, [communityId, isReacted]);

  const fetchCommunityData = () => {
    fetch("https://jiggasha.onrender.com/communities/single/" + communityId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error("Community error:", err));
  };

  const fetchPosts = () => {
    fetch("https://jiggasha.onrender.com/communities/allPosts/" + communityId, {
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

      const response = await fetch(
        "https://jiggasha.onrender.com/communities/newPost",
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

  if (loading) return <Loading />;

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
          {community?.current_user_picture ? (
            <img src={community.current_user_picture} alt="User" />
          ) : (
            <div className="psudoProfilePicture">
              {community?.current_user_name?.[0]}
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
      <div className="postBoxContainer ">
        {posts.length === 0 ? (
          <NotFound type="post" />
        ) : (
          posts.map((post) => (
            <PostBox
              key={post.post_id}
              post_id={post.post_id}
              author_picture={post.author_picture}
              author_name={post.author_name}
              created_at={post.created_at}
              content={post.content}
              media={post.media}
              comment_count={post.comment_count}
              reaction_count={post.reaction_count}
              is_reacted={post.is_reacted}
              communityId={communityId}
            />
          ))
        )}
      </div>
    </>
  );
}
