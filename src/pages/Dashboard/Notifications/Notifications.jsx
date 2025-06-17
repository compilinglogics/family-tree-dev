import React, { useState } from 'react'
import "./Notifications.scss";
import { Form, Nav, Tab } from 'react-bootstrap';
import RequestCard from '../RequestCard/RequestCard';
import Icon1 from "../../../assets/icons/requestsCard/Earlier/icons/Icon-1.svg";
import Icon2 from "../../../assets/icons/requestsCard/Earlier/icons/Icon-2.svg";
import Icon3 from "../../../assets/icons/requestsCard/Earlier/icons/Icon-3.svg";
import User1 from "../../../assets/icons/requestsCard/Earlier/users/User-1.png";
import User2 from "../../../assets/icons/requestsCard/Earlier/users/User-2.png";
import User3 from "../../../assets/icons/requestsCard/Earlier/users/User-3.png";
import CommonModal from '../CommonModal/CommonModal';
import RangeSlider from '../RangeSlider/RangeSlider';
import LargeCoin from '../../../assets/images/LargeCoin.svg'
const earlierNotifications = [
  {
    id: 1,
    icon: Icon1,
    user: User1,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '6 hours ago'
  },
  {
    id: 2,
    icon: Icon2,
    user: User2,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '6 hours ago'
  },
  {
    id: 3,
    icon: Icon3,
    user: User3,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '6 hours ago'
  },
  {
    id: 4,
    icon: Icon1,
    user: User1,
    title: 'Robin Buckley shred a reel: Design Faster With The Best Figma AI Plugins 😍⚡',
    subTitle: '6 hours ago'
  },
]
const Notifications = () => {
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(0.3);
  const [sucessModal, setSucessModal] = useState(false)
  const [rewardModal, setRewardModal] = useState(true)

  function handlePubmish(params) {
    setShowModal(false)
    setSucessModal(true)
  }
  return (
    <div className="mt-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <div className="same_poppins_1 bg_secondary py-3 px-3 same_shadow_border">
          NOTIFICATIONS
        </div>
        <Nav variant="pills" className={`bg_secondary same_shadow_border flex-row  py-2 px-3 rounded-pill gap-3 navigation_buttons my-4`}>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="first">All</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="second">My Story</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="first">
            <span className='same_poppins_1 d-block ps-3 mb-2'>
              New
            </span>
            <RequestCard onSecondClick={() => setShowModal(true)} type="notification" title="Rachel Podrez is inviting you, as a cousin, to be included in the family tree." subTitle='6 hours ago' />
            <RequestCard type="notification" title="Rachel Podrez is inviting you, as a cousin, to be included in the family tree." subTitle='6 hours ago' />
            <RequestCard type="notification" title="Rachel Podrez is inviting you, as a cousin, to be included in the family tree." subTitle='6 hours ago' />
            <span className='same_poppins_1 d-block ps-3 mb-2'>
              Earlier
            </span>
            {earlierNotifications.length > 0 && earlierNotifications.map((user, index) =>
              <RequestCard key={index} type="earlier" icon={user.icon} user={user.user} title={user.title} subTitle={user.subTitle} />
            )}

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
            {/* {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )} */}
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
