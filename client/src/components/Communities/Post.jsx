"use client";
import React, { useEffect, useState } from "react";
import dp from "../../../public/images/demo_profile_image.jpg";
import CommentBox from "../../components/Communities/CommentBox";
import NotFound from "../../components/ui/NotFound";
import HeaderAlt from "../../components/ui/HeaderAlt";
import PostCard from "./PostCard";

import { useParams } from "next/navigation";

export default function Post() {
  const { communityId, postId } = useParams();
  const [post, setPost] = useState({});
  const [commentators, setCommentators] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  const [updatePost, setUpdatePost] = useState(0);

  const handleChange = (e) => {
    const { value } = e.target;
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setCommentContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (commentContent == "") {
      alert("Write something in comment box!");
      return;
    }

    fetch("http://localhost:8000/communities/post/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentContent: commentContent,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success") {
          console.log("Comment Success!");
          setCommentContent("");
          setUpdatePost((prevData) => prevData + 1);
        } else {
          alert(data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:8000/communities/singlePost/" + postId)
      .then((res) => res.json())
      .then((data) => {
        const postData = data?.post || {};
        const commentsData = data?.post?.commentators || [];

        setPost(postData);
        setCommentators(commentsData);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [updatePost]);

  function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="mainContent">
      <HeaderAlt title={`${post.author_name || "Anonymous"}'s Post`} />
      <div className="postBoxContainer">
        {Object.keys(post).length > 0 && (
          <PostCard
            key={post.post_id}
            postId={post.post_id}
            posterId={post.member_id}
            posterName={post.author_name || "Anonymous"}
            posterPicture={post.author_picture}
            content={post.content}
            postTimeAgo={getTimeAgo(post.created_at)}
            postMediaArray={post.media || []}
            isPostReacted={!!post.is_reacted}
            postReactionCount={parseInt(post.reaction_count)}
            postCommentCount={parseInt(post.comment_count)}
            postTime={post.created_at}
            setUpdatePost={setUpdatePost}
            con
          />
        )}
        <div className="giveCommentBox">
          <form onSubmit={handleSubmit}>
            <div className="profilePicture">
              <img src={post.author_picture ? post.author_picture : dp} />
            </div>
            <textarea
              id="content"
              name="content"
              placeholder="Write something..."
              onChange={handleChange}
              value={commentContent}
            />
            <button className="postButton" type="submit">
              Comment
            </button>
          </form>
        </div>
        <div className="commentBoxContainer">
          <div className="title">Comments</div>
          {commentators.length > 0 ? (
            commentators.map(function (commentator, index) {
              return (
                <CommentBox
                  key={index}
                  commentatorId={commentator.commentator_name}
                  commentatorPicture={commentator.user_picture}
                  commentContent={commentator.comment}
                  commentatorName={commentator.full_name}
                  commentTimeAgo={commentator.commented_at}
                />
              );
            })
          ) : (
            <NotFound type="comments" />
          )}
        </div>
      </div>
    </div>
  );
}
