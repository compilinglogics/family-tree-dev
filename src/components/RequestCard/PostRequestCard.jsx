import React, { useState } from 'react'
import './RequestCard.scss'
import { Button, Form } from 'react-bootstrap';
import { confirmCommentRequests, confirmPostRequests } from '../../utils/familytreeApi';
import CommonModal from '../CommonModal/CommonModal';

const PostRequestCard = ({ item, getApi }) => {

  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(0.3);
  function handlePubmish(params) {
    setShowModal(false)
    setSucessModal(true)
  }

  const handleSubmit = async (confirmation) => {
    try {
      const sandData = {
        postId: item?.postId?._id,
        accept: confirmation ? true : false,
        reject: confirmation ? false : true,
        pps: range,
        notificationId: item?._id
      };
      // console.log(sandData);

      const request = await confirmPostRequests(sandData);
      setShowModal(false)
      getApi()
      setTimeout(() => {
        window.location.reload();
      }, 500);
      console.log("request" , request);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error confirming request:', error.response.data.message);
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
            <span className='message mb-0 d-block'>{item?.text}</span>
            <span className='message mb-0 d-block'>New Post added by {item?.requestedBy?.fullName}</span>
            <span className='time'>{item?.postId?.text}</span>
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
            min="0.5"
            max="5"
            step="0.5"
            value={range}
            style={{
              "--progress": `${((range - 0.5) / (5 - 0.5)) * 100}%`,
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

export default PostRequestCard;
