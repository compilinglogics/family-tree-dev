// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { getUserById } from "../../utils/Api"; 
// import { FollowUser } from "../../utils/followApi";
// import { toast } from "react-toastify";

// const ProfilePage = () => {
//   const { id } = useParams(); // Get user ID from URL params
//   const [user, setUser] = useState(null); // State for user data
//   const [isFollowing, setIsFollowing] = useState(false); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await getUserById(id); // Fetch user data
//         if (response.success) {
//           setUser(response.user);
//           console.log("response.user.isFollowing" , response.user.isFollowing);
          
//           setIsFollowing(response.user.isFolloing); // Set follow status
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     if (id) fetchUserData(); // Call API only if id exists
//   }, [id]);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//       const response = await FollowUser(id); 
//       toast.success(response?.message);
//       } else {
//       const response = await FollowUser(id); 
//       toast.success(response?.message);
//       }
//       setIsFollowing(!isFollowing); 
//     } catch (error) {
//       console.error("Error updating follow status:", error);
//     }
//   };

//   if (!user) return <p>Loading...</p>; // Show loading if data isn't available

//   return (
//     <div className="container mt-4 d-flex justify-content-center">
//     <div className="card p-4 shadow-lg position-relative" style={{ maxWidth: "400px",minWidth:"300px", borderRadius: "12px" }}>
      
//       {/* X Close Button */}
//       <button 
//         className="position-absolute top-0 end-0 m-2 btn btn-light btn-sm rounded-circle shadow-sm"
//         onClick={() => navigate("/")}
//         style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
//       >
//         ✖
//       </button>

//       <div className="text-center">
//       <Link to={`/post/${user._id}`}>
//         <img
//           src={user.profileImageUrl || "https://via.placeholder.com/120"}
//           alt={user.fullName || "User Profile"}
//           className="rounded-circle mb-3 border"
//           width="120"
//           height="120"
//           />
//           </Link>
//         <h3 className="mb-1">{user.fullName || "John Doe"}</h3>
//         <p className="text-muted">{user.city || "Unknown City"}, {user.country || "Unknown Country"}</p>
        
//         {/* Follow/Unfollow Button */}
//         <button 
//           className={`btn btn-sm ${isFollowing ? "btn-dark" : "btn-dark"} mt-2`}
//           onClick={handleFollowToggle}
//         >
//           {isFollowing ? "Unfollow" : "Follow"}
//         </button>
//       </div>
      
//       <hr />
      
//       <div>
//         <h6 className="text-muted">About</h6>
//         <p className="text-dark">{user.bio}</p>
//       </div>
      
//       <div className="mt-3">
//         <h6 className="text-muted">Date of Birth</h6>
//         <p className="text-dark">
//           {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default ProfilePage;


"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getUserById } from "../../utils/Api"
import { FollowUser } from "../../utils/followApi"
import { toast } from "react-toastify"

const ProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id)
        if (response.success) {
          setUser(response.user)
          console.log("response.user.isFollowing", response.user.isFollowing)
          setIsFollowing(response.user.isFollowing || false)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (id) fetchUserData()
  }, [id])

  const handleFollowToggle = async () => {
    try {
      const response = await FollowUser(id)
      toast.success(response?.message)
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error updating follow status:", error)
    }
  }

  // Privacy check functions
  const canViewFullProfile = () => {
    if (!user) return false

    switch (user.account_privacy) {
      case "public":
        return true
      case "FOLLOWERS_ONLY":
        return isFollowing
      case "private":
        return false
      default:
        return false
    }
  }

  const canViewBasicInfo = () => {
    if (!user) return false
    return user.account_privacy === "public" || user.account_privacy === "FOLLOWERS_ONLY"
  }

  const getPrivacyMessage = () => {
    if (!user) return ""

    switch (user.account_privacy) {
      case "FOLLOWERS_ONLY":
        return isFollowing
          ? ""
          : "This account shares content with followers only. Follow to see their posts and details."
      case "private":
        return "This account is private. Only approved followers can see their content."
      default:
        return ""
    }
  }

  const shouldShowFollowButton = () => {
    if (!user) return false
    return user.account_privacy !== "private" || !isFollowing
  }

  // Get privacy icon and text
  const getPrivacyBadge = () => {
    switch (user?.account_privacy) {
      case "private":
        return {
          icon: "🔒", // or use <i className="fas fa-lock"></i>
          text: "Private Account",
          className: "bg-danger",
        }
      case "FOLLOWERS_ONLY":
        return {
          icon: "👥", // or use <i className="fas fa-users"></i>
          text: "Followers Only",
          className: "bg-warning text-dark",
        }
      case "public":
        return {
          icon: "🌍", // or use <i className="fas fa-globe"></i>
          text: "Public Account",
          className: "bg-success",
        }
      default:
        return null
    }
  }

  if (!user) return <p>Loading...</p>

  const privacyBadge = getPrivacyBadge()

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div
        className="card p-4 shadow-lg position-relative"
        style={{ maxWidth: "400px", minWidth: "300px", borderRadius: "12px" }}
      >
        {/* X Close Button */}
        <button
          className="position-absolute top-0 end-0 m-2 btn btn-light btn-sm rounded-circle shadow-sm"
          onClick={() => navigate("/")}
          style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          ✖
        </button>

        <div className="text-center">
          {/* Profile Image with Privacy Indicator */}
          <div className="position-relative d-inline-block">
            {canViewFullProfile() ? (
              <Link to={`/post/${user._id}`}>
                <img
                  src={user.profileImageUrl || "https://via.placeholder.com/120"}
                  alt={user.fullName || "User Profile"}
                  className="rounded-circle mb-3 border"
                  width="120"
                  height="120"
                />
              </Link>
            ) : (
              <img
                src={user.profileImageUrl || "https://via.placeholder.com/120"}
                alt={user.fullName || "User Profile"}
                className="rounded-circle mb-3 border"
                width="120"
                height="120"
              />
            )}

            {/* Privacy Icon Overlay on Profile Image */}
            {user.account_privacy !== "public" && (
              <div
                className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm"
                style={{ transform: "translate(10px, -10px)" }}
              >
                <span style={{ fontSize: "16px" }}>{user.account_privacy === "private" ? "🔒" : "👥"}</span>
              </div>
            )}
          </div>

          {/* Name with Privacy Status */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <h3 className="mb-0">{user.fullName || "John Doe"}</h3>
            {user.account_privacy !== "public" && (
              <span style={{ fontSize: "18px" }}>{user.account_privacy === "private" ? "🔒" : "👥"}</span>
            )}
          </div>

          {/* Location - Show based on privacy */}
          {canViewBasicInfo() && (
            <p className="text-muted">
              📍 {user.city || "Unknown City"}, {user.country || "Unknown Country"}
            </p>
          )}

          {/* Privacy Badge */}
          {privacyBadge && (
            <div className="mb-3">
              <span className={`badge ${privacyBadge.className}`}>
                <span className="me-1">{privacyBadge.icon}</span>
                {privacyBadge.text}
              </span>
            </div>
          )}

          {/* Follow/Unfollow Button + Tree Icon */}
          {shouldShowFollowButton() && (
          <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
          <button
          className={`btn btn-sm ${isFollowing ? "btn-outline-dark" : "btn-dark"}`}
          onClick={handleFollowToggle}
          >
          {isFollowing ? "👤➖ Unfollow" : "👤➕ Follow"}
          </button>

          {/* Tree Icon */}
          <Link to={`/tree/${user._id}`} className="btn btn-light btn-sm rounded-circle shadow-sm">
          🌳
          </Link>
          </div>
          )}
        </div>

        <hr />

        {/* Privacy Message */}
        {getPrivacyMessage() && (
          <div className="alert alert-info text-center" role="alert">
            <span className="me-2">ℹ️</span>
            {getPrivacyMessage()}
          </div>
        )}

        {/* Bio Section - Only show if can view full profile */}
        {canViewFullProfile() && (
          <div>
            <h6 className="text-muted">
              <span className="me-1">📝</span>About
            </h6>
            <p className="text-dark">{user.bio || "No bio available"}</p>
          </div>
        )}

        {/* Date of Birth - Only show if can view full profile */}
        {canViewFullProfile() && (
          <div className="mt-3">
            <h6 className="text-muted">
              <span className="me-1">🎂</span>Date of Birth
            </h6>
            <p className="text-dark">{user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}</p>
          </div>
        )}

        {/* Additional Stats for Public/Followers */}
        {canViewBasicInfo() && (
          <div className="mt-3">
            <div className="row text-center">
              <div className="col-4">
                <small className="text-muted">📄 Posts</small>
                <div className="fw-bold">{user.postsCount || 0}</div>
              </div>
              <div className="col-4">
                <small className="text-muted">👥 Followers</small>
                <div className="fw-bold">{user.followersCount || 0}</div>
              </div>
              <div className="col-4">
                <small className="text-muted">➕ Following</small>
                <div className="fw-bold">{user.followingCount || 0}</div>
              </div>
            </div>
          </div>
        )}

        {/* Restricted Content Message for Private Accounts */}
        {user.account_privacy === "private" && !isFollowing && (
          <div className="text-center mt-3">
            <div className="text-muted">
              <div style={{ fontSize: "48px" }} className="mb-2">
                🔒
              </div>
              <p>This content is private</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
