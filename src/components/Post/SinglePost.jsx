import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostDropdown from './PostDropdown'
import { Button, Modal } from 'react-bootstrap'
import { getPost } from '../../utils/postApi';

import LinkIcon from "../../assets/icons/post/Link-icon.svg";
import Verified from "../../assets/icons/post/Verified.svg";
import like from "../../assets/images/like.svg";
import likeNot from "../../assets/images/likeNot.svg";
import message from "../../assets/images/message.svg";
import share from "../../assets/images/share.svg";
import commonImage from "../../assets/images/common-like-share.png";
import PPCoin from "../../assets/images/PP-coin.svg";
import { toast } from 'react-toastify';
import { addComment } from '../../utils/familytreeApi';
import Comment from './Comment';


export default function SinglePost() {
    const [item, setItem] = useState([])
    const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [comments, setComments] = useState({});
  const { id  } = useParams()

    const user = JSON.parse(localStorage.getItem("user"));

    const callPostApi = async () => {
        try {
          const response = await getPost(id);
          if (response.success) setItem(response.post);

          console.log("response", response.post);
          console.log("item", item);
          
        } catch (error) {
          toast.error(error?.message);
        }
      };
    
      useEffect(() => {
        callPostApi();
      }, []);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };

      // Comment functions
  const toggleCommentBox = (postId) => {
    setActiveCommentBox((prev) => (prev === postId ? null : postId));
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    try {
      if (comments[postId]?.trim()) {
        await addComment({ id: postId, comment: comments[postId] });
        callPostApi();
        setComments((prev) => ({ ...prev, [postId]: "" }));
        setActiveCommentBox(null);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Like function
  const likePost = async (postId) => {
    try {
      const likeRes = await postLike(postId);
      toast.success(likeRes?.message);
      callPostApi();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // url 

  const [shareUrl, setShareUrl] = useState(""); // Store URL for sharing
  const [showModal, setShowModal] = useState(false); 
  const [copySuccess, setCopySuccess] = useState(false); 
  const handleShareClick = (postId) => {
    console.log(postId);
    
      setShareUrl(`${window.location.origin}/post/${postId}`); // Set share URL
      setShowModal(true); // Show modal
  };

  const handleCopy = () => {
  
    if (navigator.clipboard && window.isSecureContext) {
      // Modern secure method
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(err => {
        console.error('Clipboard write failed:', err);
      });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
  
      document.body.removeChild(textArea);
    }
};


  return (
    <div key={item._id} className="main-post-line same_shadow_border bg_secondary py-3 px-4 mt-3">
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div className="d-flex align-items-center">
        <Link to={`/post/${item.mainUser}`}>
        <img className="avatar me-2 rounded-pill" src={item.userId?.profileImageUrl} />
        </Link>
        <div className="d-flex flex-column">
          <span className="d-flex align-items-center mb-1">
            <span className="name">{item.userId?.fullName}</span>
            {item?.userId?.greenTick && <img className="verified-icon ms-1" src={Verified} alt="" />}
            {item?.userId?.isLinked && <img className="link-icon" src={LinkIcon} alt="" />}
            {/* <Link className="line-height-0">
              <img className="link-icon" src={LinkIcon} alt="" />
            </Link> */}
          </span>
          <div className="post-location">
            {item.userId?.country}
            <span className="coins-counter">
              <span className="number">{item.userId?.ppScore}</span>
              <img className="img-fluid" src={PPCoin} />
            </span>
          </div>
        </div>
      </div>
      {item.userId?._id === user._id ? 
        <PostDropdown item={item} page={'my-post'} getApi={callPostApi}  /> :
        <PostDropdown item={item} page={'all-post'} getApi={callPostApi}  />
      }
    </div>

    <div style={{ whiteSpace: "pre-line" }} className="image-post-content mb-3">{item.text}</div>

    <div className="row justify-content-between mb-3">
      {item.videoUrl && (
        <video className="col-4 img-fluid post-inner-video" autoPlay muted loop controls>
          <source src={item.videoUrl} type="video/mp4" />
        </video>
      )}
      {item.imagesUrls?.map((img, index) => (
        <img key={index} src={img} alt="post-image" className="col-4 img-fluid post-inner-img" />
      ))}
    </div>

    {item.audioUrl && (
      <audio className="col-4 img-fluid post-inner-audio" controls>
        <source src={item.audioUrl} type="audio/mpeg" />
      </audio>
    )}

    <div className="mb-1 d-flex justify-content-between align-items-center">
      <span className="comment-likes">
        {item.comments?.filter(c => c.isAccepted).length} Comments · {item.shares} Shares · {item.likes?.length} Likes
      </span>
      <span className="comment-likes">{formatDate(item.eventDate)}</span>
    </div>

    <div className="post-item mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2 align-items-center">
          {item.likes?.includes(user._id) ? 
            <img onClick={() => likePost(item._id)} src={likeNot} alt="like" className="like-img" /> :
            <img onClick={() => likePost(item._id)} src={like} alt="like" className="like-img" />
          }
          <img src={message} alt="comment" className="like-img" onClick={() => toggleCommentBox(item._id)} />
          <img 
                        src={share} 
                        alt="share" 
                        className="like-img me-2" 
                        onClick={() => handleShareClick(item._id)} 
                        style={{ cursor: "pointer"}} 
                    />
        </div>
        {/* <div className="d-flex gap-2 align-items-center">
          <img className="emojis img-fluid" src={commonImage} alt="common-img" />
        </div> */}
      </div>

      {activeCommentBox === item._id && (
        <div className="mt-3 d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={comments[item._id] || ""}
            onChange={(e) => handleCommentChange(item._id, e.target.value)}
          />
          <Button onClick={() => handleCommentSubmit(item._id)} variant='dark' className='accept-button rounded-pill py-2 px-5'>
            Comment
          </Button>
        </div>
      )}
    </div>

    <hr className="horizontal-line-between-comment" />

    {item.comments
      ?.filter(c => c.isAccepted)
      .reverse()
      .map((comment) => (
        <Comment key={comment._id} comment={comment} PostId={item._id} />
      ))}
 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Share this Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        value={shareUrl} 
                        readOnly 
                    />
                    <Button variant="primary" onClick={handleCopy} className="w-100">
                        Copy Link
                    </Button>
                    {copySuccess && <p className="text-success mt-2 text-center">Copied to clipboard!</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
  </div>
  )
}
