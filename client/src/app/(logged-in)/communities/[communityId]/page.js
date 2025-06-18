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
} from "react-icons/fa";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat, hexToUrl } from "@/utils/Functions";
import {
  FaAngleDown,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaUser,
  FaUserGroup,
} from "react-icons/fa6";

export default function SingleCommunity() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Fetch community info
    fetch("http://localhost:8000/communities/single/" + communityId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error("Community error:", err));

    // Fetch posts
    fetch("http://localhost:8000/communities/allPosts/" + communityId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .catch((err) => console.error("Posts error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  function getMediaMimeType(mediaType) {
  switch (mediaType) {
    case 'image': return 'image/jpeg'; // or determine actual format
    case 'video': return 'video/mp4';
    case 'audio': return 'audio/mpeg';
    default: return 'application/octet-stream';
  }
}

  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;

    const post = {
      title: "New Post",
      community_id: communityId,
      content: postContent,
      approval_status: "pending",
      approver_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      media: selectedFiles.map((file) => ({
        media_id: crypto.randomUUID(),
        media_blob: URL.createObjectURL(file), // Temporary preview URL
        media_type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
          ? "audio"
          : file.type.startsWith("video/")
          ? "video"
          : "document",
      })),
    };
    console.log("Creating post for community:", communityId);

    try {
      const response = await fetch(
        "http://localhost:8000/communities/newPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(post),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Post created:", data);
        setNewPost("");
        setSelectedFiles([]);
      } else {
        console.error("Failed to create post:", data.error);
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An unexpected error occurred.");
    }
  };
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
                <div className="text">{community?.total_members}1 members</div>
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
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mediaContainer">
              {selectedFiles.map((file, index) => (
                <div key={index} className="media">
                  <div className="remove" onClick={() => removeFile(index)}>
                    <FaTimes />
                  </div>
                  {file.type.startsWith("image/") && (
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  )}
                  {file.type.startsWith("audio/") && (
                    <div className="audio">
                      <FaMusic style={{ fontSize: "24px", color: "#666" }} />
                      <div className="duration">Audio</div>
                    </div>
                  )}
                  {file.type.startsWith("video/") && (
                    <div className="audio">
                      <FaVideo style={{ fontSize: "24px", color: "#666" }} />
                      <div className="duration">Video</div>
                    </div>
                  )}
                  {!file.type.startsWith("image/") &&
                    !file.type.startsWith("audio/") &&
                    !file.type.startsWith("video/") && (
                      <div className="audio">
                        <FaFile style={{ fontSize: "24px", color: "#666" }} />
                        <div className="duration">File</div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          <div className="buttonContainer">
            <div className="attachButtons">
              <div className="attachButton">
                <FaImage className="icon" />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </div>
              <div className="attachButton">
                <FaMicrophone className="icon" />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </div>
              <div className="attachButton">
                <FaPaperclip className="icon" />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </div>
              {/* <div className="selectContainer">
                <select
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  name="classLevel"
                  value={selectedCategory}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="downIcon" />
              </div> */}
            </div>
            <button
              type="submit"
              className="sendButton"
              onClick={handlePostSubmit}
            >
              <FaPaperPlane className="icon" />
              <div className="text">Post</div>
            </button>
          </div>
        </div>
      </div>

      <div className="miniBreak" />

      {/* Posts List */}
      <div className="postBoxContainer">
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            No posts yet.
          </div>
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

              {/* Media rendering */}
              {post.media?.length > 0 && (
                <div className="mediaContainer">
                  {post.media.map((media) => {
                    const url = media.media_blob; // Already decoded on the server

                    switch (media.media_type) {
                      case "image":
                        return (
                          <img
                            key={media.media_id}
                            src={url}
                            alt="post-media"
                            className="rounded-md max-w-full my-2"
                          />
                        );
                      case "audio":
                        return (
                          <div key={media.media_id} className="my-2">
                            <audio controls>
                              <source src={url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        );
                      case "video":
                        return (
                          <div key={media.media_id} className="my-2">
                            <video
                              controls
                              className="w-full max-h-[400px] rounded-md"
                            >
                              <source src={url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        );
                      case "document":
                        return (
                          <div
                            key={media.media_id}
                            className="inline-block px-4 py-2 bg-gray-100 rounded-lg my-2"
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 font-medium hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              )}

              <div className="postDetails">
                <span className="detail">{post.reaction_count} reactions</span>
                <span className="divider"></span>
                <span className="detail">{post.comment_count} comments</span>
              </div>

              <div className="postActionBoxContainer">
                <div className="postActionBox">
                  <FaThumbsUp className="icon" />
                  <span className="text">Likes</span>
                </div>
                <div className="postActionBox">
                  <FaComment className="icon" />
                  <span className="text">Comments</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
