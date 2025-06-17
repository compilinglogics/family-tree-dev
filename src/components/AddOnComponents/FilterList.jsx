import React from 'react';
import { Button, NavLink } from 'react-bootstrap';
import { FollowUser } from '../../utils/followApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function FilterList({ user, setFilteredUsers }) {
    const navigate = useNavigate();
    console.log("user" , user);
    

    const followUser = async (event, ID) => {
        event.stopPropagation(); // Prevent navigation on button click

        try {
            const response = await FollowUser(ID);
            console.log("response?.message f", response?.message);
            toast.success(response?.message);
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(error?.message);
        }
    };

    return (
        <div
            key={user.id}
            className="d-flex align-items-center p-2 text-dark w-100"
            onClick={() => {
                setFilteredUsers([]);  
                navigate(`/profile/${user._id}`);  
              }}
            style={{ cursor: "pointer" }} // Make it clear it's clickable
        >
            <div className="w-100">
                <div className="d-flex align-items-center justify-content-between mb-3 p-2 border-bottom w-100">
                    {/* Profile Picture & Name */}
                    <div className="d-flex align-items-center">
                        <img
                            src={user.profileImageUrl}
                            alt={user.fullName}
                            className="rounded-circle me-2"
                            width="40" height="40"
                        />
                        <div className="d-flex flex-column">
                            {/* User Name */}
                            <span className="fw-bold">{user.fullName}</span>
                            {/* City & DOB */}
                            <small className="text-muted">
                                {user.city} • {new Date(user.dob).toLocaleDateString("en-GB", {
                                   
                                    year: "numeric"
                                })}
                            </small>
                        </div>
                    </div>

                    <Button
                        variant={user.isFollowing ? "dark" : "outline-dark"}
                        size="sm"
                        onClick={(event) => followUser(event, user._id)}
                    >
                        {user.isFollowing ? "Following" : "Follow"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FilterList;
