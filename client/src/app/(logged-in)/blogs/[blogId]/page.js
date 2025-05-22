"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaCaretDown, FaCaretUp, FaComment, FaEye } from "react-icons/fa6";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat } from "@/utils/Functions";
import { FaCalendarAlt } from "react-icons/fa";

export default function SingleBlog() {
  const { blogId } = useParams();

  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(true);

  const [totalVote, setTotalVote] = useState(null);
  const [votingStatus, setVotingStatus] = useState(null);


  const vote = async (e, vote) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("http://localhost:8000/blogs/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          blogId: blogId,
          vote: vote
        }),
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote((prev) => parseInt(prev) + parseInt(vote) - parseInt(votingStatus));
        setVotingStatus(vote);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unvote = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("http://localhost:8000/blogs/unvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          blogId: blogId
        })
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote((prev) => parseInt(prev) - parseInt(votingStatus));
        setVotingStatus(0);
      } else {
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/blogs/single/" + blogId, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blogData = await response.json();
        setBlog(blogData);
        setTotalVote(blogData.vote_count);
        setVotingStatus(blogData.is_voted);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>Loading</>
    );
  }
  else {
    return (
      <>
        <HeaderAlt title={blog.author_name + "'s Blog"} />
        {loading ? (
          <div className="loading"></div>
        ) : (
          <div className="blogBox">
            {blog.cover_image_url ? <img
              className="previewImage"
              src={blog.cover_image_url}
            /> : <div className="psudoPreviewImage"><FaComment /></div>}

            <div className="details">
              <div className="titleContainer">
                <div className="title">{blog.title}</div>
                <div className="tags">
                  <div className="orangeTag">{subjectName[blog.subject]}</div>
                  <div className="grayTag">{classLevelName(blog.class_level)}</div>
                </div>
              </div>
              <div className="voting">
                {
                  votingStatus == 1 ? (
                    <div onClick={(e) => { unvote(e) }} className="button active">
                      <FaCaretUp className="icon" />
                    </div>
                  ) : (
                    <div onClick={(e) => { vote(e, 1) }} className="button">
                      <FaCaretUp className="icon" />
                    </div>
                  )
                }
                <div className="count">
                  {totalVote}
                </div>
                {
                  votingStatus == -1 ? (
                    <div onClick={(e) => { unvote(e) }} className="button active">
                      <FaCaretDown className="icon" />
                    </div>
                  ) : (
                    <div onClick={(e) => { vote(e, -1) }} className="button">
                      <FaCaretDown className="icon" />
                    </div>
                  )
                }
              </div>
            </div>
            <hr />
            <div className="informationContainer">
              <div className="author">
                <div className="profilePicture">
                  {blog.author_picture_url ? (
                    <img
                      src={blog.author_picture_url}
                    />
                  ) : (
                    <div className="psudoProfilePicture">
                      {blog.author_name[0]}
                    </div>
                  )}
                </div>
                <div className="nameContainer">
                  <div className="createdBy">Created By</div>
                  <div className="name">{blog.author_name}</div>
                </div>
              </div>
              <div className="informations">
                <div className="information">
                  <FaCalendarAlt className="icon" />
                  <div className="text">{dateFormat(blog.created_at)}</div>
                </div>
                <div className="information">
                  <FaEye className="icon" />
                  <div className="text">{blog.view_count}</div>
                </div>
              </div>
            </div>
            <hr />
            <div 
              className="content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            >
              
            </div>
          </div>
        )}
      </>
    );
  }
}
