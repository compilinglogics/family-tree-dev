import "./Tree.scss";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import UserImage1 from "../../assets/images/User-Image.png";
import ThreeDots from "../../assets/images/3 dots.svg";
import Verified from "../../assets/icons/post/Verified.svg";
import TreeCard from "../../components/TreeCard/TreeCard";
import Requests from "../../components/Requests/Requests";

const Tree = () => {
  return (
    <div className="mt-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Nav
          variant="pills"
          className={`bg_secondary same_shadow_border flex-row  py-2 px-3 rounded-pill gap-3 navigation_buttons my-4`}
        >
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="first">
              Family Tree
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="second">
              Requests
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="first">
            <Row>
              <Col md={{ span: 12 }}>
                <div className="line-container-1 d-flex align-items-start justify-content-between">
                  <TreeCard
                    image={UserImage1}
                    name={"Alber John"}
                    address={"1970, Hamburg Riyana John"}
                    isVerified
                  />
                  <div style={{ marginTop: "95px" }} className="w-100">
                    <div className="vertical-line-1"></div>
                    <div className="horizontal-line-1"></div>
                  </div>
                  <TreeCard
                    image={UserImage1}
                    name={"Alber John"}
                    address={"1970, Hamburg Riyana John"}
                    isVerified
                    isSquare
                  />
                </div>
                <div className="line-container-2">
                  <div
                    style={{ marginLeft: "95px", marginRight: "95px" }}
                    className="vertical-line-1 "
                  ></div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="horizontal-line-2"></div>
                      <TreeCard
                        image={UserImage1}
                        name={"Alber John"}
                        address={"1970, Hamburg Riyana John"}
                        isVerified
                      />

                      <div className="horizontal-line-2"></div>
                    </div>
                    <div>
                      <div className="horizontal-line-2"></div>
                      <TreeCard
                        image={UserImage1}
                        name={"Alber John"}
                        address={"1970, Hamburg Riyana John"}
                        isVerified
                        isSquare
                        isDark
                        addMember
                      />
                    </div>
                  </div>
                </div>
                <div className="line-container-3">
                  <div
                    style={{ marginLeft: "95px", marginRight: "95px" }}
                    className="vertical-line-1 "
                  ></div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="horizontal-line-2"></div>
                      <TreeCard
                        image={UserImage1}
                        name={"Alber John"}
                        address={"1970, Hamburg Riyana John"}
                        isVerified
                      />
                    </div>
                    <div>
                      <div className="horizontal-line-2"></div>
                      <TreeCard
                        image={UserImage1}
                        name={"Alber John"}
                        address={"1970, Hamburg Riyana John"}
                        isVerified
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey="second">
            <Requests />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Tree;
