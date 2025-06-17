import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { getFollowers } from '../../utils/followApi';
import { toast } from 'react-toastify';

function FollowersList({followers}) {
    const [followers2, setFollowers] = useState([
        { id: 1, name: "John Doe", profilePic: "https://via.placeholder.com/50", isFollowing: true },
        { id: 2, name: "Jane Smith", profilePic: "https://via.placeholder.com/50", isFollowing: false },
        { id: 3, name: "Alex Johnson", profilePic: "https://via.placeholder.com/50", isFollowing: true },
      ]);


      const getDataApi = async () => {
        try {
          const response = await getFollowers();
          console.log("response f" , response);
          
          if (response.success) {
            
            setFollowers(response?.followings)
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          toast.error(error?.message);
        }
    };
  
    useEffect(() => {
      getDataApi()
    }, [])

  return (
    <div className="form-outline mb-4">
    {followers.length > 0 ? (
      followers.map((user) => (
        <div 
          key={user.id} 
          className="d-flex align-items-center justify-content-between mb-3 p-2 border-bottom"
        >
          {/* Profile Picture & Name */}
          <div className="d-flex align-items-center">
            <img 
              src={user.profileImageUrl} 
              alt={user.fullName} 
              className="rounded-circle me-2" 
              width="40" height="40"
            />
            <span className="fw-bold">{user.fullName}</span>
          </div>
          <Button
                  variant={true ? "dark" : "outline-dark"} 
                  size="sm"
                  onClick={() => toggleFollow(user.id)}
                >
                  {true ? "Following" : "Follow"}
                </Button>
        </div>
      ))
    ) : (
      <p className="text-muted text-center">No followers yet</p>
    )}
  </div>
  )
}

export default FollowersList