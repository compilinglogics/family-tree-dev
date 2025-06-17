import "./Tree.scss";
import { Nav, Tab } from "react-bootstrap";
import RequestCard from "../RequestCard/RequestCard";
import FamilyTreePage from "../FamilyTreePage/FamilyTreePage";
import Family from "../FamilyTree/Family";
import { useEffect, useState } from "react";
import { getRequests } from "../../utils/familytreeApi";
import { END_POINTS } from "../../common/endPoints";
import { getApiRequest } from "../../utils/getApiRequest";

const Tree = () => {
  const [allRequests, setRequests ] = useState([])

  const callApiGetData = async () => {
      try {
        // const response = await getRequests();
        const response = await getApiRequest(END_POINTS.NEW_GET_RELATIONS_REQUEST);
        console.log("response" , response);
        console.log("response requests" , response.requests);
        if (response.success) {
          
          setRequests(response?.requests)
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
    <div className="mt-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Nav variant="pills" className={`bg_secondary same_shadow_border flex-row  py-2 px-3 rounded-pill gap-3 navigation_buttons my-4`}>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="first">Family Tree</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="rounded-pill px-5" eventKey="second">Requests</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="first">
            <FamilyTreePage />
            {/* <Family/> */}
          </Tab.Pane>
          <Tab.Pane eventKey="second">
            <span className='same_poppins_1 d-block ps-3 mb-2'>
              New
            </span>

            {
              allRequests.map((item) => (
                <RequestCard title={`${item?.requesting_user?.fullName} is inviting you, as a ${item?.relationship_type}, to be included in the family tree.`} user={item} profileImg={item?.profileImageUrl}  getApi={callApiGetData} />
              ))
            }
      
            {/* <RequestCard title="Rachel Podrez is inviting you, as a cousin, to be included in the family tree." subTitle='6 hours ago' /> */}
            {/* <RequestCard title="Rachel Podrez is inviting you, as a cousin, to be included in the family tree." subTitle='6 hours ago' /> */}
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Tree;
