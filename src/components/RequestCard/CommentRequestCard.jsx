import React, { useState } from 'react'
import './RequestCard.scss'
import { Button, Form } from 'react-bootstrap';
import { confirmCommentRequests } from '../../utils/familytreeApi';
import CommonModal from '../CommonModal/CommonModal';
import { toast } from 'react-toastify';

const CommentRequestCard = ({ item, getApi }) => {

  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(0.3);
  function handlePubmish(params) {
    setShowModal(false)
    setSucessModal(true)
  }

  const handleSubmit = async (confirmation) => {
    try {
      const sandData = {
        commentId: item?.commentDetails?.commentId,
        postId: item?.postId?._id,
        accept: confirmation ? true : false,
        reject: confirmation ? false : true,
        pps: range,
        notificationId: item?._id
      };

      const request = await confirmCommentRequests(sandData);
      setShowModal(false)
      getApi()
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      if (request.staus) {
        toast.success(request.message);
      }else{
        toast.error(request.message);
      }
      

    } catch (error) {
      toast.error(error.response.data.message);
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
            <span className='message mb-0 d-block'>New Comment on your Post</span>
            <span className='time'>{item?.commentDetails?.text}</span>
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
            // value={formData.password}
            // onChange={handleChange}
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

export default CommentRequestCard;
