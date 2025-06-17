import React, { useEffect, useState } from 'react'
import "./Notifications.scss";
import { Form, Nav, Tab } from 'react-bootstrap';
import RequestCard from '../RequestCard/RequestCard';
import Icon1 from "../../assets/icons/requestsCard/Earlier/icons/Icon-1.svg";
import NewUserl from "../../assets/icons/requestsCard/User1.png";
import Icon2 from "../../assets/icons/requestsCard/Earlier/icons/Icon-2.svg";
import Icon3 from "../../assets/icons/requestsCard/Earlier/icons/Icon-3.svg";
import User1 from "../../assets/icons/requestsCard/Earlier/users/User-1.png";
import User2 from "../../assets/icons/requestsCard/Earlier/users/User-2.png";
import User3 from "../../assets/icons/requestsCard/Earlier/users/User-3.png";
import CommonModal from '../CommonModal/CommonModal';
import RangeSlider from '../RangeSlider/RangeSlider';
import LargeCoin from '../../assets/images/LargeCoin.svg'
import CommentRequestCard from '../RequestCard/CommentRequestCard';
import { getComment } from '../../utils/familytreeApi';
import SubComment from './SubComment';
import NotificationList from './NotificationList';
const earlierNotifications = [
  {
    id: 1,
    icon: Icon1,
    user: User1,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '2025-01-28T20:26:03.957Z',
    createdAt: '2025-01-28T20:26:03.957Z'
  },
  {
    id: 2,
    icon: Icon2,
    user: User2,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '2025-01-28T20:26:03.957Z',
    createdAt: '2025-01-28T20:26:03.957Z'
  },
  {
    id: 3,
    icon: Icon3,
    user: User3,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '2025-01-28T20:26:03.957Z',
    createdAt: '2025-01-28T20:26:03.957Z'
  },
  {
    id: 4,
    icon: Icon1,
    user: User1,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '2025-01-28T20:26:03.957Z'
  },
]
const Notifications = () => {
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(0.3);
  const [sucessModal, setSucessModal] = useState(false)
  const [rewardModal, setRewardModal] = useState(false)

  function handlePubmish(params) {
    setShowModal(false)
    setSucessModal(true)
  }


  // all comment requests
  const [allRequests, setRequests ] = useState([])

  const callApiGetData = async () => {
      try {
        const response = await getComment();
        if (response.success) {
          
          setRequests(response?.comments)
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
    <div className="mt-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <div className="bg_secondary py-1 px-3 mb-3 same_shadow_border cursor-pointer">
        <div className=" py-2 px-4 same_poppins_2 fw-500 text-uppercase" variant="transparent">
          Notifications
        </div>
      </div>
        {/* <Nav variant="pills" className={`bg_secondary same_shadow_border flex-row  py-2 px-3 rounded-pill gap-3 navigation_buttons my-4`}>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="first">All</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="second">My Story</Nav.Link>
          </Nav.Item>
        </Nav> */}
        <Tab.Content>
          <Tab.Pane eventKey="first">
            <NotificationList/>
            {/* <span className='same_poppins_2 fw-500 d-block ps-3 mb-2'>
              Comment request
            </span>
            {
              allRequests
              .slice().reverse()
              .map((item) => (
                <CommentRequestCard item={item} getApi={callApiGetData} showModel />
                // <RequestCard title={`${item?.fullName} is inviting you, as a ${item?.relation}, to be included in the family tree.`} user={item} profileImg={item?.profileImageUrl} subTitle='6 hours ago' getApi={callApiGetData} />
              ))
            } */}
            
            {/* <CommentRequestCard user={NewUserl} onSecondClick={() => setShowModal(true)} type="notification" title="Want to add comment on your post" subTitle='6 hours ago' /> */}
            {/* <span className='same_poppins_2 fw-500 d-block ps-3 mb-2'>
              New
            </span>
            <RequestCard user={NewUserl} onSecondClick={() => setShowModal(true)} type="notification" title="Eric Sinclair posted in your story." subTitle='6 hours ago' />
            <RequestCard user={NewUserl} onSecondClick={() => setShowModal(true)} type="notification" title="Eric Sinclair posted in your story." subTitle='6 hours ago' />

            <span className='same_poppins_1 d-block ps-3 mb-2'>
              Earlier
            </span>
            {earlierNotifications.length > 0 && earlierNotifications.map((user, index) =>
              <RequestCard key={index} type="earlier" icon={user.icon} user={user.user} title={user.title} subTitle={user.subTitle} />
            )} */}

          </Tab.Pane>
          <Tab.Pane eventKey="second">
          </Tab.Pane>
        </Tab.Content>
        <CommonModal title="Publish Comment" show={showModal} onHide={() => setShowModal(false)} secondButtonAction={handlePubmish} hideFirstAction >
          <div className="form-outline mb-4">
            <Form.Label>Range</Form.Label>
            <RangeSlider className="mb-5" min='0.1' max='0.5' step='0.1' value={range} onChange={(e) => setRange(e.target.value)} />

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
          </div>
        </CommonModal>
        <CommonModal show={sucessModal} onHide={() => setSucessModal(false)} hideActions hideHeader >
          <div className="position-relative text-center">

            <span className='same_poppins_1'>
              Reward Successful! 🎉
            </span>
            <button onClick={() => setSucessModal(false)} type="button" className="btn-close custom-close-btn position-absolute end-0" aria-label="Close"></button>
          </div>
        </CommonModal>
        <CommonModal show={rewardModal} onHide={() => setRewardModal(false)} hideActions hideHeader >
          <div className="position-relative text-center">

            <button onClick={() => setRewardModal(false)} type="button" className="btn-close custom-close-btn position-absolute end-0" aria-label="Close"></button>
            <img className='d-block mx-auto mb-2' src={LargeCoin} alt="" />
            <div className='mx-5 px-sm-2 px-md-5'>


              <span className='same_poppins_1 d-inline-block mb-2'>

                Weekly Reset
              </span>
              <p className='mb-0'>
                PP Credits reset to 10. Unused credits have expired.
              </p>
            </div>
          </div>
        </CommonModal>
      </Tab.Container>
    </div>
  )
}

export default Notifications
