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

export default function SingleCommunity() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = [
    "General",
    "Question",
    "Discussion",
    "Announcement",
    "Resource",
  ];

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

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission logic here
      setNewPost("");
      setSelectedFiles([]);
    }
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

      <div className="blogBox">
        {community?.cover_image_url ? (
          <img
            className="previewImage"
            src={community.cover_image_url}
            alt="Community Cover"
          />
        ) : (
          <div className="psudoPreviewImage">No Image</div>
        )}

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
          <div className="informations">
            <div className="information">
              <FaCalendarAlt className="icon" />
              <div className="text">{dateFormat(community?.created_at)}</div>
            </div>
            <div className="information">
              <span className="icon">👥</span>
              <div className="text">
                {community?.total_members ?? 0} members
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="content">
          <p>{community?.description || "No description provided."}</p>
        </div>

        <hr />

      </div>
        {/* Give Post Box */}
        <div className="givePostBox">
          <div className="profilePicture">
            {community?.admin_picture ? (
              <img src={community.admin_picture} alt="Profile" />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "60px",
                  border: "5px solid #ffffff",
                  backgroundColor: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {community?.admin_name?.[0] || "U"}
              </div>
            )}
          </div>

          <div className="textBox">
            <div className="textareaContainer">
              <textarea
                value={newPost}
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

            <div className="addMediaContainer">
              <div className="addMedia">
                <FaImage className="icon" />
                <span className="text">Add Media</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </div>

              <div
                className="changeCategory"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <span className="icon">📂</span>
                <span className="text">{selectedCategory}</span>
                <FaChevronDown className="dropdownIcon" />

                {showCategoryDropdown && (
                  <div className="categoryContainer">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="category"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="postButton" onClick={handlePostSubmit}>
            Post
          </div>
        </div>

        <div className="miniBreak" />

        {/* Posts List */}
        <div className="postBoxContainer">
          {posts.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#666", padding: "40px" }}
            >
              No posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.post_id} className="postBox">
                <div className="reportButton">
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
                    <div className="name">
                      {post.author_name || "Anonymous"}
                    </div>
                    <div className="detail">
                      {new Date(post.created_at).toLocaleDateString()}
                      {post.is_pinned && <span> • 📌 Pinned</span>}
                    </div>
                  </div>
                </div>

                <div className="postContent">
                  <strong>{post.title}</strong>
                  {"\n"}
                  {post.content}
                </div>

                {/* Media rendering */}
                {post.media?.length > 0 && (
                  <div className="mediaContainer">
                    {post.media.map((media) => {
                      const url = hexToUrl(media.media_blob);
                      switch (media.media_type) {
                        case "image":
                          return (
                            <img
                              key={media.media_id}
                              src={url}
                              alt="post-media"
                            />
                          );
                        case "audio":
                          return (
                            <div
                              key={media.media_id}
                              className="audioContainer"
                            >
                              <FaMusic className="icon" />
                              <audio controls>
                                <source src={url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          );
                        case "video":
                          return (
                            <video key={media.media_id} controls>
                              <source src={url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          );
                        case "document":
                          return (
                            <div
                              key={media.media_id}
                              style={{
                                display: "inline-block",
                                padding: "10px",
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                                margin: "6px",
                              }}
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#6366f1",
                                  textDecoration: "none",
                                }}
                              >
                                <FaFile style={{ marginRight: "8px" }} />
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
                  <span className="detail">{post.view_count} views</span>
                  <span className="divider"></span>
                  <span className="detail">{post.comment_count} comments</span>
                  <span className="divider"></span>
                  <span className="detail">
                    {post.reaction_count} reactions
                  </span>
                </div>

                <div className="postActionBoxContainer">
                  <div className="postActionBox">
                    <FaEye className="icon" />
                    <span className="text">View</span>
                  </div>
                  <div className="postActionBox">
                    <FaComment className="icon" />
                    <span className="text">Comment</span>
                  </div>
                  <div className="postActionBox">
                    <FaThumbsUp className="icon" />
                    <span className="text">Like</span>
                  </div>
                  <div className="postActionBox">
                    <FaShare className="icon" />
                    <span className="text">Share</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </>
  );
}
