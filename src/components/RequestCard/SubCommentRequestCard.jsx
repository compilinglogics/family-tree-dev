import React, { useState } from 'react'
import './RequestCard.scss'
import { Button, Form } from 'react-bootstrap';
import { confirmSubCommentRequests } from '../../utils/familytreeApi';
import CommonModal from '../CommonModal/CommonModal';

const SubCommentRequestCard = ({ item, getApi }) => {

  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(1);


  const handleSubmit = async (confirmation) => {
    try {
      const sandData = {
        commentId: item?.commentDetails?.commentId,
        subCommentId: item?.subCommentDetails?.subCommentId,
        postId: item?.postId?._id,
        accept: confirmation ? true : false,
        reject: confirmation ? false : true,
        pps: range,
        notificationId: item?._id
      };

      await confirmSubCommentRequests(sandData);
      setShowModal(false)
      getApi()
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error confirming request:', error);
    }
  };

  return (
    <>
      <div className='request-card px-3 mb-3'>
        <div className={`position-relative d-flex align-items-start gap-3`}>
          <span className="status-circle top-0"></span>
          <div className="request-avatar">
            {/* <img className='user rounded-pill' src={profileImg} alt="" /> */}
            {/* <img className='userIcon' src={icon} alt="" /> */}
          </div>
          <div className="request-detail">
            <span className='message mb-0 d-block'>New Reply on your comment </span>
            <span className='time'>{item?.subCommentDetails?.text || "No text available"}</span>
            {/* <span className='time'>6 hours ago</span> */}
            {
              item?.isAccepted === false ?
                <div className="actions mt-2">
                  <Button onClick={() => handleSubmit(false)} variant='transparent' className='reject-button rounded-pill py-2 px-5 me-3'>
                    Reject
                  </Button>
                  <Button onClick={() => setShowModal(true)} variant='dark' className='accept-button rounded-pill py-2 px-5'>
                    Publish
                  </Button>
                </div>
                : ''
            }

          </div>
        </div>

      </div>

      <CommonModal title="Publish Comment" show={showModal} onHide={() => setShowModal(false)} secondButtonAction={handleSubmit} hideFirstAction >
        <div className="form-outline mb-4">
          <Form.Label>Range</Form.Label>
          {/* <RangeSlider className="mb-5 h-5" min='0.1' max='1' step='0.1' value={range} onChange={(e) => setRange(e.target.value)} /> */}
          <input
            type="range"
            className="custom-range-slider"
            min="0.1"
            max="1"
            step="0.1"
            value={range}
            style={{
              "--progress": `${((range - 0.1) / (1 - 0.1)) * 100}%`,
            }}
            onChange={(e) => setRange(e.target.value)}
          />


          <label className="form-label" htmlFor="password">
            Your PP Deduction
          </label>
          <input
            disabled
            name="ppDeduction"
            value={range}
            type="number"
            id="ppDeduction"
            className="border-0 sign-up-input form-control"
          />
          {/* {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )} */}
        </div>
      </CommonModal>
    </>
  );
};

export default SubCommentRequestCard;
