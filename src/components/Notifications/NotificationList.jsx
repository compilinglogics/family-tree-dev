import React, { useEffect, useState } from 'react'
import { getNotification, getSubComment } from '../../utils/familytreeApi';
import CommentRequestCard from '../RequestCard/CommentRequestCard';
import SubCommentRequestCard from '../RequestCard/SubCommentRequestCard';
import PostRequestCard from '../RequestCard/PostRequestCard';
import OtherNotifications from './OtherNotifications';
import FollowRequest from '../RequestCard/FollowRequest';

export default function NotificationList() {
    const [Notifications, setNotifications] = useState([])
    const [unSeenNotifications, setunSeenNotifications] = useState([])

    const callApiGetData = async () => {
        try {
            const response = await getNotification();
            if (response.success) {
                setNotifications(response?.notifications)
                setunSeenNotifications(response?.unSeenNotifications)
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(error?.message);
        }
    };

    useEffect(() => {
        callApiGetData()
    }, [])
    return (
        <>
            <span className='same_poppins_2 fw-500 d-block ps-3 mb-2'>
            New notification
            </span>
            {
                unSeenNotifications.slice().reverse().map((item) => {
                    if (item.type === "subcomment") {
                        return (
                            <SubCommentRequestCard
                                key={item.subcommentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else if (item.type === "comment") {
                        return (
                            <CommentRequestCard
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else if (item.type === "post") {
                        return (
                            <PostRequestCard
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else {
                        return (
                            <OtherNotifications
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    }
                })
            }
            <hr />
            {
                Notifications.slice().reverse().map((item) => {
                    if (item.type === "subcomment") {
                        return (
                            <SubCommentRequestCard
                                key={item.subcommentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else if (item.type === "comment") {
                        return (
                            <CommentRequestCard
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else if (item.type === "post") {
                        return (
                            <PostRequestCard
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else if (item.type === "follow_request") {
                        return (
                            <FollowRequest
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    } else {
                        return (
                            <OtherNotifications
                                key={item.commentId} // Add a unique key
                                item={item}
                                getApi={callApiGetData}
                                showModel
                            />
                        );
                    }
                })
            }

        </>
    )
}

