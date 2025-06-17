import React from 'react'
import './RequestCard.scss'
import User from "../../assets/icons/requestsCard/User.svg";
import UserIcon from "../../assets/icons/requestsCard/UserIcon.svg";
import Notification from "../../assets/icons/requestsCard/Notification.svg";
import { Button } from 'react-bootstrap';
import { confirmRequests, confirmRequests_new } from '../../utils/familytreeApi';
import { formatDistanceToNow } from "date-fns";
import { toast } from 'react-toastify';

const RequestCard = ({ type, title, subTitle, profileImg, icon, user, onFirstClick, onSecondClick, getApi}) => {

    const handleSubmit = async (confirmation) => {
        try {
            const sandData = {
                // userId: user?._id,
                status: confirmation
            };
            // await confirmRequests(sandData);
            const data = await confirmRequests_new(sandData, user?._id);
            toast.success(`${data.message}`);
            getApi()
        } catch (error) {
            toast.error(error?.response?.data?.error);
            console.error('Error confirming request:', error);
        }
    };

    return (
        <div className='request-card px-3 mb-3'>
            <div className={`position-relative d-flex ${type === 'earlier' ? "align-items-center" : "align-items-start"} gap-3`}>
                {type !== 'earlier' && (<span className="status-circle top-0"></span>)}
                <div className="request-avatar">
                    {profileImg ? <img className='user rounded-pill' src={profileImg} alt="" /> : <img src={User} alt="" />}

                    {type === 'earlier' ? <img className='userIcon' src={icon} alt="" /> : (type === 'notification' ? <img className='userIcon' src={Notification} alt="" /> : <img className='userIcon' src={UserIcon} alt="" />)}
                </div>
                <div className="request-detail">
                    <span className='message mb-0 d-block'>{title}</span>
                    {
                        user?.createdAt ? 
                        <span className='time'>{formatDistanceToNow(new Date(user?.createdAt), { addSuffix: true })}</span>
:''
                    }
                    {type === 'earlier' ?
                        ""
                        :
                        <div className="actions mt-2">
                            {
                                user?.status == "Accepted" ? 
                                <Button onClick={() => handleSubmit("Rejected")} variant='transparent' className='reject-button rounded-pill py-2 px-5 me-3'>
                                {type === 'notification' ? "Delete" : "Reject"}
                            </Button>
                             : 
                             <>
                             <Button onClick={() => handleSubmit("Rejected")} variant='transparent' className='reject-button rounded-pill py-2 px-5 me-3'>
                                {type === 'notification' ? "Delete" : "Reject"}
                            </Button>
                            <Button onClick={() => handleSubmit("Accepted")} variant='dark' className='accept-button rounded-pill py-2 px-5'>
                                {type === 'notification' ? "Publish" : "Accept"}
                            </Button>
                            </>
                            }
                            {/* <Button onClick={() => handleSubmit(false)} variant='transparent' className='reject-button rounded-pill py-2 px-5 me-3'>
                                {type === 'notification' ? "Delete" : "Reject"}
                            </Button>
                            <Button onClick={() => handleSubmit(true)} variant='dark' className='accept-button rounded-pill py-2 px-5'>
                                {type === 'notification' ? "Publish" : "Accept"}
                            </Button> */}
                        </div>
                    }
                </div>
            </div>

        </div>
    );
};

export default RequestCard;
