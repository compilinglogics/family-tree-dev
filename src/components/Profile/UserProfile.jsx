import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../utils/Api"; 
import { FollowUser } from "../../utils/followApi";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { id } = useParams(); // Get user ID from URL params
  const [user, setUser] = useState(null); // State for user data
  const [isFollowing, setIsFollowing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id); // Fetch user data
        if (response.success) {
          setUser(response.user);
          console.log("response.user.isFollowing" , response.user.isFollowing);
          
          setIsFollowing(response.user.isFolloing); // Set follow status
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) fetchUserData(); // Call API only if id exists
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
      const response = await FollowUser(id); 
      toast.success(response?.message);
      } else {
      const response = await FollowUser(id); 
      toast.success(response?.message);
      }
      setIsFollowing(!isFollowing); 
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (!user) return <p>Loading...</p>; // Show loading if data isn't available

  return (
    <div className="container mt-4 d-flex justify-content-center">
    <div className="card p-4 shadow-lg position-relative" style={{ maxWidth: "400px",minWidth:"300px", borderRadius: "12px" }}>
      
      {/* X Close Button */}
      <button 
        className="position-absolute top-0 end-0 m-2 btn btn-light btn-sm rounded-circle shadow-sm"
        onClick={() => navigate("/")}
        style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        ✖
      </button>

      <div className="text-center">
      <Link to={`/post/${user._id}`}>
        <img
          src={user.profileImageUrl || "https://via.placeholder.com/120"}
          alt={user.fullName || "User Profile"}
          className="rounded-circle mb-3 border"
          width="120"
          height="120"
          />
          </Link>
        <h3 className="mb-1">{user.fullName || "John Doe"}</h3>
        <p className="text-muted">{user.city || "Unknown City"}, {user.country || "Unknown Country"}</p>
        
        {/* Follow/Unfollow Button */}
        <button 
          className={`btn btn-sm ${isFollowing ? "btn-dark" : "btn-dark"} mt-2`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
      
      <hr />
      
      <div>
        <h6 className="text-muted">About</h6>
        <p className="text-dark">{user.bio}</p>
      </div>
      
      <div className="mt-3">
        <h6 className="text-muted">Date of Birth</h6>
        <p className="text-dark">
          {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "N/A"}
        </p>
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;
