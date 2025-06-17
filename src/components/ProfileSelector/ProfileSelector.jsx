import './ProfileSelector.scss'
import React from 'react'
import user from "../../assets/images/people.svg";
import EditProfile from '../../assets/images/edit_profile.svg'
import { Image } from 'react-bootstrap';
const ProfileSelector = ({ image, fileRef, handleChange, handleClick }) => {
    return (
        <div className="profile-selector text-center">
            <img className={"mb-2 cursor-pointer " + (image ? 'userImage' : 'dummyImage')}
                onClick={handleClick}
                src={image ? URL.createObjectURL(image) : user} alt="loading-img" />
            {image ?
                <div className='edit-box d-flex justify-content-center align-items-center'>
                    <Image className='img-fluid' src={EditProfile} />
                    <p className='title mb-0 ms-2'>Edit Profile Image</p>
                </div>
                :
                <p className='title'>+ Add Profile Image</p>
            }
            <input
                hidden
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleChange}
                className="form-control"
            />
        </div>
    )
}

export default ProfileSelector
