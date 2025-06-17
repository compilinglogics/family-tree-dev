import React from 'react'

const OtherNotifications = ({ item }) => {


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
            <span className='time'>{item?.postId?.text}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherNotifications;
