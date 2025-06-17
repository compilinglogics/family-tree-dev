import "./Post.scss";
import { Button, Container, Dropdown } from "react-bootstrap";
import ThreeDots from "../../assets/images/3 dots.svg";
import ThreeDotsGrey from "../../assets/images/3DotsGrey.svg";
import PPCoin from "../../assets/images/PP-coin.svg";
import ProfileImage from "../../assets/images/home-page-post.png";
import CommentImage from "../../assets/images/Comment1.png";
import LinkIcon from "../../assets/icons/post/Link-icon.svg";
import Verified from "../../assets/icons/post/Verified.svg";
import like from "../../assets/images/like.svg";
import message from "../../assets/images/message.svg";
import share from "../../assets/images/share.svg";
import commonImage from "../../assets/images/common-like-share.png";
import postImage from "../../assets/images/post-image.svg";
import postImage2 from "../../assets/images/post-2.svg";
import { Link } from "react-router-dom";
import { getAllMyPosts } from "../../utils/postApi";
import { useEffect, useState } from "react";
import PostDropdown from "./PostDropdown";

const MyPosts = ({list}) => {
  const [list2, setlist] = useState([])
  const user = JSON.parse(localStorage.getItem("user"));

  const callApiGetData = async () => {
    try {
      // const response = await getAllPost("6716b6c43e3566cc3a147b07");
      const response = await getAllMyPosts(user._id);
      console.log("response", response);
      if (response.success) {
        setlist(response.posts)
      }
      console.log("response", response);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    callApiGetData()
  }, [])

  function formatDate(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${hours}:${formattedMinutes} ${ampm} ${day}/${month}/${year}`;
  }

  return (
    <div className="pb-3">

      {
        list.slice().reverse().map((item) => (
          <div className="main-post-line same_shadow_border bg_secondary py-3 px-4 mt-3 ">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <img className="avatar me-2 rounded-pill" src={ProfileImage} />
                <div className="d-flex flex-column">
                  <span className="d-flex align-items-center mb-1">
                    <span className="name">{item.userId?.fullName}</span>
                    <img className="verified-icon ms-1" src={Verified} alt="" />
                    <Link className="line-height-0">
                      <img className="link-icon" src={LinkIcon} alt="" />
                    </Link>
                  </span>
                  <div className="post-location">
                    1946 , Dallas , US <br />

                    <span className="coins-counter">
                      <span className="number">
                        10
                      </span>
                      <img className="img-fluid" src={PPCoin} />

                      Erica Sinclair

                    </span>
                  </div>
                </div>
              </div>
              <PostDropdown item={item} page={'my-post'} getApi={callApiGetData} />
              {/* <Button className="post-line-btn p-0" variant="transparent">
                <img className="img-fluid" src={ThreeDots} />
              </Button> */}
            </div>
            <div style={{ whiteSpace: "pre-line" }} className="image-post-content mb-3">
              {item.text}
            </div>
            <div className=" row justify-content-between mb-3">
              {item.videoUrl && (
                <video className="col-4 img-fluid post-inner-video"
                  autoPlay
                  muted
                  loop
                  controls>
                  <source src={item.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {
                item.imagesUrls ? item?.imagesUrls.map((img) => (
                  <img src={img} alt="post-image" className="col-4 img-fluid post-inner-img" />
                ))
                  : ''
              }
              {/* <img src={postImage2} alt="post-image" className="img-fluid post-inner-img" /> */}
              {/* <img src={postImage} alt="post-image" className="img-fluid post-inner-img" /> */}
            </div>

            {item.audioUrl && (
              <>
                <audio
                  className="col-4 img-fluid post-inner-audio"
                  controls
                  style={{ maxWidth: "100%" }}
                > hello
                  <source src={item.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </>
            )}




            <div className="mb-1 d-flex justify-content-between align-items-center">
              <span className="comment-likes">{item.comments.length} Comments . {item.shares} Shares . {item.likes} Likes</span>
              <span className="comment-likes">
              {formatDate(item.createdAt)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <img src={like} alt="loading-like-img" className="like-img" />
                <img src={message} alt="loading-like-img" className="like-img" />
                <img src={share} alt="loading-like-img" className="like-img" />
              </div>
              {/* <div className="d-flex gap-2 align-items-center">
                <p className="m-0 comment-likes">Q&A with Mark & 361k others</p>
                <img className="emojis img-fluid" src={commonImage} alt="common-img" />
              </div> */}
            </div>
            <hr className="horizontal-line-between-comment" />
            {/* <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex">
                <img className="comment-avatar me-2 rounded-pill" src={CommentImage} />
                <div>
                  <span className="comment-user-name">Mark Ramos</span>
                  <br />
                  <p className="m-0 post-location">
                    Greet work! Well done girl. 👏🏽{" "}
                  </p>
                  <p className="d-flex gap-3 comment-actions mb-0">
                    <span className="like">Like</span>
                    <span className="reply">Reply</span>
                    <span className="time">2m</span>
                  </p>
                </div>
              </div>
              <Button variant="transparent comment-menu" className="p-0">
                <img className="img-fluid" src={ThreeDotsGrey} alt="" />

              </Button>
            </div> */}
          </div>
        ))
      }

      {/* <div className="main-post-line same_shadow_border bg_secondary py-3 px-4 mt-3 ">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <img className="avatar me-2 rounded-pill" src={ProfileImage} />
            <div className="d-flex flex-column">
              <span className="d-flex align-items-center mb-1">
                <span className="name">Erina Yamashita</span>
                <img className="verified-icon ms-1" src={Verified} alt="" />
                <Link className="line-height-0">
                  <img className="link-icon" src={LinkIcon} alt="" />
                </Link>
              </span>
              <div className="post-location">
                1946 , Dallas , US <br />

                <span className="coins-counter">
                  <span className="number">
                    10
                  </span>
                  <img className="img-fluid" src={PPCoin} />

                  Erica Sinclair

                </span>
              </div>
            </div>
          </div>
          <Button className="post-line-btn p-0" variant="transparent">
            <img className="img-fluid" src={ThreeDots} />
          </Button>
        </div>
        <div className="image-post-content mb-3">
          Hey pals, guess what? 🎉 I've just wrapped up crafting these mind-blowing 3D wallpapers, drenched in the coolest of the cool colors! 🌈💎
        </div>
        <div className="d-flex justify-content-between mb-3">
          <img src={postImage} alt="post-image" className="img-fluid post-inner-img" />
          <img src={postImage2} alt="post-image" className="img-fluid post-inner-img" />
          <img src={postImage} alt="post-image" className="img-fluid post-inner-img" />
        </div>
        <div className="mb-1 d-flex justify-content-between align-items-center">
          <span className="comment-likes">3.4k Comments . 46 Shares . 46 Likes</span>
          <span className="comment-likes">
            8:20 AM <span>10/12/2024</span>
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <img src={like} alt="loading-like-img" className="like-img" />
            <img src={message} alt="loading-like-img" className="like-img" />
            <img src={share} alt="loading-like-img" className="like-img" />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <p className="m-0 comment-likes">Q&A with Mark & 361k others</p>
            <img className="emojis img-fluid" src={commonImage} alt="common-img" />
          </div>
        </div>
        <hr className="horizontal-line-between-comment" />
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex">
            <img className="comment-avatar me-2 rounded-pill" src={CommentImage} />
            <div>
              <span className="comment-user-name">Mark Ramos</span>
              <br />
              <p className="m-0 post-location">
                Greet work! Well done girl. 👏🏽{" "}
              </p>
              <p className="d-flex gap-3 comment-actions mb-0">
                <span className="like">Like</span>
                <span className="reply">Reply</span>
                <span className="time">2m</span>
              </p>
            </div>
          </div>
          <Button variant="transparent comment-menu" className="p-0">
            <img className="img-fluid" src={ThreeDotsGrey} alt="" />

          </Button>
        </div>
      </div> */}


    </div>
  );
};

export default MyPosts;
