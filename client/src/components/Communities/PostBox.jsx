"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {
    FaMusic,
    FaComment,
    FaThumbsUp,
    FaFlag,
    FaFilePdf
} from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa6";


const PostBox = ({
    post_id,
    author_picture,
    author_name,
    created_at,
    content,
    media,
    comment_count,
    reaction_count,
    is_reacted,
    communityId
}) => {
    const [isReacted, setIsReacted] = useState(is_reacted);
    const [reactionCount, setReactionCount] = useState(reaction_count);

    const handleReport = () => {
        alert("Report feature is not implemented yet.");
    };

    const reactPost = async (e) => {
        console.log("hu.lo");
        try {
            const response = await fetch("http://localhost:8000/communities/post/react", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({
                    postId: post_id,
                }),
            });

            const result = await response.json();

            console.log(result);

            if (result.message === "Liked") {
                setIsReacted(true);
                setReactionCount((prev) => parseInt(prev) + 1);
            } else if (result.message === "Unliked") {
                setIsReacted(false);
                setReactionCount((prev) => parseInt(prev) - 1);
            }
            else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        // fetch("http://localhost:8000/communities/post/react", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     credentials: "include",
        //     cache: "no-cache",
        //     body: JSON.stringify({ postId: post_id }),
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data);
        //         if (data.status === "Success") {
        //             if (data.message === "Liked") {
        //                 setIsReacted(true);
        //                 setReactionCount((prev) => parseInt(prev) + 1);
        //             } else {
        //                 setIsReacted(false);
        //                 setReactionCount((prev) => parseInt(prev) - 1);
        //             }
        //         } else {
        //             alert(data.message || "Something went wrong");
        //         }
        //     })
        //     .catch((err) => console.error("Error reacting to post:", err));
    }

    return (
        <div
            key={post_id}
            className="postBox border border-gray-300 rounded-lg shadow-sm"
        >
            <div className="reportButton" onClick={handleReport}>
                <FaFlag className="icon" />
                <span className="text">Report</span>
            </div>

            <div className="profile">
                <div className="profilePicture">
                    {author_picture ? (
                        <img src={author_picture} alt="Author" />
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
                            {author_name?.[0] || "?"}
                        </div>
                    )}
                </div>

                <div className="profileDetail">
                    <div className="name">{author_name || "Anonymous"}</div>
                    <div className="detail">
                        {new Date(created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="postContent">{content}</div>

            {media?.length > 0 && (
                <div className="px-5">
                    {media && media.length > 0 && (
                        <div className="">
                            {media.map((media, index) => {
                                const url = media.media_url;
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
                                                        <audio
                                                            controls
                                                            autoPlay={false}
                                                            className="w-full"
                                                        >
                                                            <source src={url} type="audio/mpeg" />
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
                                                        autoPlay={false}
                                                        className="w-full max-h-[500px] bg-black"
                                                        
                                                    >
                                                        <source src={url} type="video/mp4" />
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
                <span className="detail">{reactionCount} reactions</span>
                <span className="divider"></span>
                <span className="detail">{comment_count} comments</span>
            </div>

            <div className="postActionBoxContainer">
                {isReacted ? (
                    <div
                        className="postActionBox liked"
                        onClick={reactPost}
                    >
                        <FaThumbsUp className="icon" />
                        <span className="text">Liked</span>
                    </div>
                ) : (
                    <div
                        className="postActionBox"
                        onClick={reactPost}
                    >
                        <FaRegThumbsUp className="icon " />
                        <span className="text">Like</span>
                    </div>
                )}
                <Link
                    href={`/communities/${communityId}/${post_id}`}
                    className="postActionBox"
                >
                    <FaComment className="icon" />
                    <span className="text">Comments</span>
                </Link>
            </div>
        </div>
    );
}

const MediaContainer = ({ children }) => (
    <div className="media-container my-4 rounded-xl overflow-hidden shadow border-2 border-orange-200 bg-orange-50">
        {children}
    </div>
);

export default PostBox;
