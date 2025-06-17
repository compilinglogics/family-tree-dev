import React, { useEffect, useState } from 'react';
import './Profile.scss'
import User from '../../assets/images/Profile-1.jpg'
import Verified from '../../assets/images/Verified.svg'
import playIcon from '../../assets/images/play-icon.png'
import LinkIcon from '../../assets/icons/post/Link-icon.svg'
import PpCoin from '../../assets/images/PP-coin.svg'
import { Button, Form, Image, Nav, Tab } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import LeftArroow from '../../assets/images/LeftArrow.svg'
import Post from '../Post/Post';
import Photo1 from '../../assets/images/post/Post-1.png'
import Photo2 from '../../assets/images/post/Post-2.png'
import Photo3 from '../../assets/images/post/Post-3.png'
import Video1 from '../../assets/images/video/Video-Imag-1.png'
import Video2 from '../../assets/images/video/Video-Imag-2.png'
import Video3 from '../../assets/images/video/Video-Imag-3.png'
import GalleryIcon from '../../assets/images/Gallery Icon.svg'
import VideoIcon1 from '../../assets/images/Video_Icon.svg'
import CommonModal from '../CommonModal/CommonModal';
import MyPosts from '../Post/MyPosts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../../store/feature/userSlice';
import FollowersList from '../AddOnComponents/FollowersList';
import { getFollowers } from '../../utils/followApi';
import { getAllMyPosts } from '../../utils/postApi';
import InfoTab from './InfoTab';
import { privacy } from '../../utils/getUser';
import { toast } from 'react-toastify';
import LinkedAccount from './LinkedAccount';


import { FaPen } from 'react-icons/fa';
import { ProfileUpdate } from '../../utils/Api';


const PRIVATE = "private";
const FOLLOWERS_ONLY = "followers only";

const Profile = () => {
  const getInitialPrivacySetting = () => {
    const stored = localStorage.getItem("privacySetting");
    return stored !== null ? JSON.parse(stored) : true;
  };

  const [privacySetting, setPrivacySetting] = useState(getInitialPrivacySetting);

  const [selectedPrivacy, setSelectedPrivacy] = useState(null);

  const localUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const settings = [
    {
      id: 1,
      name: "Reported accounts",
      to: "#"
    },
    {
      id: 2,
      name: "Help & Support",
      to: "/help-and-support"
    },
    {
      id: 3,
      name: "Terms of use",
      to: "/terms-of-use"
    },
    {
      id: 4,
      name: "Privacy policy",
      to: "/privacy-policy"
    },
    {
      id: 5,
      name: "Manage Notification",
      to: "/notifications"
    },
    {
      id: 6,
      name: "Privacy Settings",
      to: "#",
      handleClick: () => {
        setPrivacySetting(prev => !prev);
      }
    },
  ]

  function logout() {
    localStorage.clear();
    navigate("/login")
    window.location.href = "/login";
  }

  useEffect(() => {
    localStorage.setItem("privacySetting", JSON.stringify(privacySetting));
  }, [privacySetting]);



  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);
  const [userData, setUserData] = useState()

  useEffect(() => {
    setUserData(user.user);
    console.log(user.user);

  }, [user]);

  const info = {
    email: userData?.email,
    dob: userData?.dob,
    gender: userData?.gender,
    location: userData?.country,
    age: Math.floor((new Date() - new Date(userData?.dob)) / (1000 * 60 * 60 * 24 * 365.25)),
    bio: userData?.bio,
  }

  // useEffect(() => {
  //   dispatch(fetchComments());
  // }, [dispatch]);

  const [showFollowersModal, setShowFollowersModal] = useState(false)

  // api for followings

  const [followers, setFollowers] = useState([]);


  const getDataApi = async () => {
    try {
      const response = await getFollowers();

      if (response.success) {

        setFollowers(response?.followings)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error?.message);
    }
  };

  //-----------
  const [list, setlist] = useState([])
  const [Imagelist, setImagelist] = useState([])
  const [videoList, setVideolist] = useState([])

  const [playingVideo, setPlayingVideo] = useState(null);

  const handlePlayVideo = (index) => {
    setPlayingVideo(index);
  };


  const callApiGetData = async () => {
    try {
      // const response = await getAllPost("6716b6c43e3566cc3a147b07");
      const response = await getAllMyPosts(localUser._id);
      console.log("response", response);
      if (response.success) {
        setlist(response.posts)
        const allImages = response.posts.flatMap(post => post.imagesUrls || []);
        setImagelist(allImages);

        const allVideo = response.posts.flatMap(post => post.videoUrl || []);
        setVideolist(allVideo);
        console.log("allVideo", allVideo);

      }
      console.log("response", response);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error?.message);
    }
  };


  useEffect(() => {
    getDataApi()
    callApiGetData()
  }, [])

  // Load saved privacy setting from localStorage on mount
  useEffect(() => {
    const savedSetting = localStorage.getItem("account_privacy");
    if (savedSetting) {
      setSelectedPrivacy(savedSetting);
    }
  }, []);

  const handlePrivacy = async (name) => {
    try {
      const response = await privacy({ account_privacy: name });

      if (response.success) {
        setSelectedPrivacy(name); // Save selected setting
        localStorage.setItem("account_privacy", name); // Store in localStorage
        toast.success(response?.message || "Privacy setting updated!");
        setPrivacySetting(false); // Close the modal on successful save
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
      toast.error(error?.message || "Failed to update privacy setting.");
    }
  };


  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      // Step 1: Upload to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', file);
      cloudinaryData.append('upload_preset', 'profile'); // your cloudinary unsigned upload preset
      cloudinaryData.append('cloud_name', 'dqzjmgfre');

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dqzjmgfre/image/upload', {
        method: 'POST',
        body: cloudinaryData,
      });

      const cloudinaryResult = await cloudinaryResponse.json();

      if (cloudinaryResponse.ok) {
        const imageUrl = cloudinaryResult.secure_url;

        // Step 2: Send URL to your server

        try {
          // const response = await getAllPost("6716b6c43e3566cc3a147b07");
          const response = await ProfileUpdate({ profileImageUrl: imageUrl });
          toast.success('image Updated');
        } catch (error) {
          console.error("Error verifying OTP:", error);
          toast.error(error?.message);
        }

      } else {
        console.error('Cloudinary upload failed', cloudinaryResult);
      }
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };


  const isVideo = (url) => {
    return url.match(/\.(mp4|mov|webm|ogg)$/i);
  };

  return (
    <div className='profile'>
      <div className='line-card d-flex gap-2 align-items-center bg_secondary py-3 px-2 mb-3 rounded_border'>
        {/* <Image className='user-img rounded-pill' src={userData?.profileImageUrl} /> */}
        <div className="position-relative d-inline-block" style={{ width: "100px", height: "100px" }}>
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : userData?.profileImageUrl}
            alt="Profile"
            className="rounded-circle img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Hidden input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="d-none"
            id="profileImageInput"
          />

          {/* Edit button */}
          <label
            htmlFor="profileImageInput"
            className="position-absolute bottom-1 end-1 translate-middle p-2 bg-white rounded-circle shadow-sm"
            style={{ cursor: "pointer" }}
          >
            <FaPen size={12} className="text-primary" />
          </label>
        </div>
        <div>
          <div className="fw-bold userTitle d-flex align-items-center">
            {userData?.fullName}
            {userData?.greenTick ? <Image className='ms-1 verified' src={Verified} /> : ''}
            {userData?.isLinked ? <Image className='ms-1 link' src={LinkIcon} /> : ''}

            {/* <Link>
              <Image className='ms-1 link' src={LinkIcon} />
            </Link> */}
          </div>
          <div className="userSubTitle">
            {new Date(userData?.dob).getFullYear()} , {userData?.country}  <br />
            <span className='fw-bold clr_primary'>{userData?.ppScore?.toFixed(1)}{" "}</span>
            <Image className='ms-1 link' src={PpCoin} />
          </div>
        </div>
        <div>

        </div>
      </div>
      <div className="profile-statics bg_secondary rounded_border d-flex gap-3 py-3 px-3 mb-3">
        <span className='count'>
          <span className='number fw-bold'>{list.length}</span>{" "}
          Post
        </span>
        <span className='count'>
          <span className='number fw-bold'>{followers.length}</span>{" "}
          Followers
        </span>
        {/* <span className='count'>
          <span className='number fw-bold'>{followers.length}</span>{" "}
          Following
        </span> */}
      </div>
      <Tab.Container className="my-4" id="left-tabs-example" defaultActiveKey="setting">
        <Nav defaultActiveKey="setting" variant="pills" className="flex-row common-tabs mb-3 gap-3">
          <Nav.Item>
            <Nav.Link className='px-4' eventKey="setting" >Settings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='px-4' eventKey="info">Info</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='px-4' eventKey="post">Posts</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='px-4' eventKey="photos">Photos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='px-4' eventKey="videos">Videos</Nav.Link>
          </Nav.Item>
          <Nav.Link
            className="px-4"
            // eventKey="videos" 
            onClick={() => setShowFollowersModal(true)}
          >
            Followers
          </Nav.Link>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="setting">
            {settings.length > 0 && settings.map((setting, index) => (
              <Link onClick={setting.handleClick ? setting.handleClick : (() => (false))} key={index} to={setting.to} className='d-flex justify-content-between align-items-center rounded_border bg_secondary text-decoration-none py-6 px-3 mb-3'>
                <span className='same_poppins_4 fw-500 fs-6'>
                  {setting.name}
                </span>
                <Button variant='dark' className=' bg_primary rounded-pill small-arrow-btn'>
                  <Image className='rotate-180 img-fluid' src={LeftArroow} />
                </Button>
              </Link>

            ))}

            <LinkedAccount />
            {/* <Link onClick={logout} to='#' className='d-flex justify-content-between align-items-center rounded_border bg_secondary text-decoration-none py-6 px-3 mb-3'>
                <span className='same_poppins_4 fw-500 fs-6'>
                  Logout
                </span>
                <Button variant='dark' className=' bg_primary rounded-pill small-arrow-btn'>
                  <Image className='rotate-180 img-fluid' src={LeftArroow} />
                </Button>
              </Link> */}

            <button
              onClick={logout}
              type="submit"
              className="add_member_btn login-btn btn-block mb-4 px-5 mx-auto"
            >
              Logout
            </button>

            <CommonModal title="Privacy Settings" submitBtnTxt='Logout' hideFirstAction></CommonModal>
          </Tab.Pane>
          <Tab.Pane eventKey="info">
            {info &&
              <>
                <InfoTab info={info} />
              </>
            }
          </Tab.Pane>
          <Tab.Pane eventKey="post">
            <MyPosts list={list} />
          </Tab.Pane>
          <Tab.Pane eventKey="photos">
            <div className="photos m-0 row g-2">
              {Imagelist.map((imgUrl, index) => (
                <div
                  key={index}
                  className={`col-sm-12 col-md-${index === 0 ? "8" : "4"} float-end ${index === 0 ? "first" : index === 1 ? "second position-relative" : "third"}`}
                >
                  <Link>
                    {/* Only show GalleryIcon on second image (index === 1) */}
                    {index === 1 && (
                      <Image
                        className="position-absolute z-5"
                        src={GalleryIcon}
                        alt="Gallery Icon"
                      />
                    )}
                    <Image src={imgUrl} alt={`Photo ${index + 1}`} />
                  </Link>
                </div>
              ))}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="videos">
            <div className="row videos m-0">
              <div className="row videos m-0">
                <div className="row videos m-0">
                  {videoList.map((mediaUrl, index) => (
                    <div key={index} className="col-sm-12 col-md-4 p-0 position-relative mb-3">
                      {playingVideo === index ? (
                        <video
                          src={mediaUrl}
                          controls
                          autoPlay
                          className="w-100"
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{ position: "relative", cursor: "pointer" }}
                          onClick={() => setPlayingVideo(index)}
                        >
                          <video
                            src={mediaUrl}
                            className="w-100"
                            muted
                            preload="metadata"
                            style={{ height: "250px", objectFit: "cover" }}
                          />
                          <img
                            src={playIcon}
                            alt="Play"
                            className="position-absolute"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "50px",
                              height: "50px",
                              pointerEvents: "none"
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {/* Privacy Settings Modal */}
      <CommonModal
        title="Privacy Settings"
        show={privacySetting}
        onHide={() => setPrivacySetting(false)}
        submitBtnTxt="Save"
        hideFirstAction
      >
        <div className="form-outline mb-4">
          <div>
            <Form.Check
              className="mb-3 grey_dark poppins_font"
              type="radio"
              id="private"
              label={PRIVATE}
              checked={selectedPrivacy === PRIVATE}
              onChange={() => handlePrivacy(PRIVATE)}
            />
            <Form.Check
              className="mb-3 grey_dark poppins_font"
              type="radio"
              id="followersOnly"
              label={FOLLOWERS_ONLY}
              checked={selectedPrivacy === FOLLOWERS_ONLY}
              onChange={() => handlePrivacy(FOLLOWERS_ONLY)}
            />
          </div>
        </div>
      </CommonModal>

      <CommonModal
        title="Followers List"
        show={showFollowersModal}
        onHide={() => setShowFollowersModal(false)}
        // submitBtnTxt="Save"
        hideFirstAction
      >
        <FollowersList followers={followers} />
      </CommonModal>
    </div>
  )
}

export default Profile


