import React from "react";
import dp from "../../../public/images/demo_profile_image.jpg";
import Link from "next/link";

export default function CommentBox({
  commentatorId,
  commentatorPicture,
  commentContent,
  commentatorName,
  commentTimeAgo,
}) {
  function calculatePostAgoTime(timeDifference) {
    if (timeDifference < 60) {
      return "Few sec ago";
    } else if (timeDifference / 60 < 60) {
      return Math.floor(timeDifference / 60) + " min ago";
    } else if (timeDifference / (60 * 60) < 24) {
      return Math.floor(timeDifference / (60 * 60)) + " hour ago";
    } else {
      return Math.floor(timeDifference / (60 * 60 * 24)) + " day ago";
    }
  }

  return (
    <div className="commentBox">
      <Link href={"/profile/" + commentatorId} className="profilePicture">
        <img src={commentatorPicture ? commentatorPicture : dp} />
      </Link>
      <div className="commentContentBox">
        <Link href={"/profile/" + commentatorId} className="name">
          {commentatorName}
        </Link>
        <div className="text">{commentContent}</div>
        <div className="details">{calculatePostAgoTime(commentTimeAgo)}</div>
      </div>
    </div>
  );
}
