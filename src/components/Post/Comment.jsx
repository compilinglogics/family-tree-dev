import { Button } from "react-bootstrap";
import React, { useState } from "react";
import CommentImage from "../../assets/images/Comment1.png";
import ThreeDotsGrey from "../../assets/images/3DotsGrey.svg";
import { addCommentReply } from "../../utils/familytreeApi";

export default function Comment({ comment, PostId }) {
    const [replyText, setReplyText] = useState("");
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    const handleReplySubmit = async () => {
        try {
            const sandData = {
                commentId: comment._id,
                postId: PostId,
                text: replyText,
            };
            await addCommentReply(sandData);
            setReplyText("");
            setIsReplyOpen(false);
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };
    console.log("comment" ,  comment);
    

    return (
        <div
            key={comment.id}
            className="d-flex flex-column justify-content-start align-items-start mb-3"
        >
            <div className="d-flex justify-content-between align-items-start w-100">
                <div className="d-flex">
                    <img
                        className="comment-avatar me-2 rounded-pill"
                        src={comment?.addedBy?.profileImageUrl}
                        alt="Comment Avatar"
                    />
                    <div>
                        <span className="comment-user-name">
                            {comment?.addedBy?.fullName || "Anonymous"}
                        </span>
                        <br />
                        <p className="m-0 post-location">
                            {comment.comment || "No comment provided."}
                        </p>
                        <p className="d-flex gap-3 comment-actions mb-0">
                            <span className="like">Like</span>
                            <span
                                onClick={() => setIsReplyOpen(!isReplyOpen)}
                                className="reply user-select-none"
                            >
                                Reply
                            </span>
                            <span className="time">{comment.time || ""}</span>
                        </p>
                        {isReplyOpen && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="form-control mb-2"
                                />
                                <Button
                                    variant="dark"
                                    size="sm"
                                    className="rounded-pill"
                                    onClick={handleReplySubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <Button variant="transparent comment-menu" className="p-0">
                    <img className="img-fluid" src={ThreeDotsGrey} alt="Options" />
                </Button>
            </div>

            {/* Display Subcomments */}
            {comment.subComments && comment.subComments.length > 0 && (
                <div className="sub-comments mt-1 ms-5">
                    {comment.subComments.map((subComment) => (
                        subComment?.isAccepted ?
                            <div key={subComment._id} className="mb-1">
                                <p className="text-muted small m-0">
                                    <strong>{subComment?.addedBy?.fullName}:</strong> {subComment.text}
                                </p>
                            </div>
                            : ''
                    ))}
                </div>
            )}
        </div>
    );
}
