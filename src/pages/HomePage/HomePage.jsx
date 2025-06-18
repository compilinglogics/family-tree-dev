import "./HomePage.scss";
import { useState } from "react";
import { Container, Modal, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Stories from "../../components/Stories/Stories";
import EventLine from "../../components/EventLine/EventLine";
import Info from "../../assets/icons/cookies/Info.svg";
import Post from "../../components/Post/Post";


const HomePage = () => {

  const [cookiesModal, setCookiesModal] = useState(false);

  return (
    <div className="min-h-screen">
      {/* <Stories /> */}
      {/* <div className="bg_secondary py-1 px-3 mb-3 same_shadow_border cursor-pointer">
        <div className=" py-2 px-4 same_poppins_2 fw-500 text-uppercase" variant="transparent">
          My Story
        </div>
      </div> */}
      <EventLine />
      <Post />
      <Modal className="cookies-modal" show={cookiesModal} fullscreen={true} onHide={() => setCookiesModal(false)}>
        <Modal.Body className="px-0">
          <Container>
            1800 266 4545

            <Row className="align-items-center py-3">
              <Col lg={{ span: 9 }}>
                <button onClick={() => setCookiesModal(false)} type="button" className="btn-close custom-close-btn float-end d-block d-lg-none" aria-label="Close"></button>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src={Info} alt="" />
                  <span className="same_poppins_1 cookies_title">
                    Your Privacy
                  </span>
                </div>
                <p className="same_poppins_2 grey_dark">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                  consequat. Duis aute irure dolor in reprehenderit in voluptate</p>
                <p className="same_poppins_2 grey_dark mb-3 mb-lg-0">velit esse <Link to={'/cookie-policy'} className="clr_primary"> Cookie Policy</Link> eu fugiat nulla pariatur.</p>
              </Col>
              <Col lg={{ span: 3 }} xxl={{ span: 2, offset: 1 }}>
                <div className="d-flex flex-column flex-sm-row flex-md-row flex-lg-column gap-3 ps-xl-4 ps-xxl-0">
                  <Button onClick={() => setCookiesModal(false)} variant="dark" className="rounded-pill dark_btn py-2 w-100"> Accept all</Button>
                  <Button onClick={() => setCookiesModal(false)} variant="dark" className="rounded-pill dark_btn py-2 w-100"> Reject all</Button>
                  <Button onClick={() => setCookiesModal(false)} variant="dark" className="rounded-pill dark_btn py-2 w-100"> Manage</Button>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default HomePage;
