import React, { useEffect, useState } from 'react'
import { getSubComment } from '../../utils/familytreeApi';
import CommentRequestCard from '../RequestCard/CommentRequestCard';
import SubCommentRequestCard from '../RequestCard/SubCommentRequestCard';

export default function SubComment() {
    const [allRequests, setRequests] = useState([])

    const callApiGetData = async () => {
        try {
            const response = await getSubComment();
            console.log("response", response);
            console.log("response requests", response.data);
            if (response.success) {
                setRequests(response?.data)
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
    return (
        <>
            <span className='same_poppins_2 fw-500 d-block ps-3 mb-2'>
                Comment Reply request
            </span>
            {
                allRequests
                    .slice().reverse()
                    .map((item) => (
                        <SubCommentRequestCard item={item} getApi={callApiGetData} showModel />
                        // <RequestCard title={`${item?.fullName} is inviting you, as a ${item?.relation}, to be included in the family tree.`} user={item} profileImg={item?.profileImageUrl} subTitle='6 hours ago' getApi={callApiGetData} />
                    ))
            }
        </>
    )
}
