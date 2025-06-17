import "./MemberModal.scss";
import Modal from 'react-bootstrap/Modal';
import Verified from "../../assets/icons/post/Verified.svg";
import UserImage1 from "../../assets/images/User-Image.png";
import Map from "../../assets/icons/memberModal/Map.svg";
import Edit from "../../assets/icons/memberModal/Edit.svg";
import Delete from "../../assets/icons/memberModal/Delete.svg";
import Report from "../../assets/icons/memberModal/Report.svg";
const MemberModal = ({ show, onHide, handleEdit, handleDelete,handleReport, selectedUser }) => {
    

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            className="member-modal"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div className="content-box">
                <Modal.Header className="align-items-start gap-3" closeButton>
                    <div
                        className={`user-avatar d-inline-block rounded-circle`}
                    >
                        <img
                            className={"rounded-circle"}
                            src={selectedUser?.profileImageUrl}
                            alt=""
                        />
                    </div>
                    <div className="card_content">
                        <span className="user-name">
                            <span>{selectedUser?.fullName}</span>

                            <img className="verified-icon" src={Verified} alt="" />

                        </span>
                        <span className="address d-block">{new Date(selectedUser?.dob).getUTCFullYear()}, {selectedUser?.city}</span>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className=" d-flex align-items-center  action-button grey-medium gap-3 py-4">
                        <div className=" icon ps-3">
                            <img
                                className={"rounded-circle"}
                                src={Map}
                                alt=""
                            />
                        </div>
                        <div className="action-text">
                        {selectedUser?.city} , {selectedUser?.country}
                        </div>
                    </div>
                    {/* <div onClick={handleEdit} className=" d-flex align-items-center  action-button grey-medium gap-3 py-4">
                        <div className=" icon ps-3">
                            <img
                                className={"rounded-circle"}
                                src={Edit}
                                alt=""
                            />
                        </div>
                        <div className="action-text">
                            Edit
                        </div>
                    </div> */}
                    <div onClick={handleDelete} className=" d-flex align-items-center  action-button grey-medium gap-3 py-4">
                        <div className=" icon ps-3">
                            <img
                                className={"rounded-circle"}
                                src={Delete}
                                alt=""
                            />
                        </div>
                        <div className="action-text">
                            Delete Member
                        </div>
                    </div>
                    <div onClick={handleReport} className=" d-flex align-items-center  action-button grey-medium gap-3 py-4 mb-3">
                        <div className=" icon ps-3">
                            <img
                                className={"rounded-circle"}
                                src={Report}
                                alt=""
                            />
                        </div>
                        <div className="action-text">
                            Report Member
                        </div>
                    </div>
                </Modal.Body>
            </div>
        </Modal>
    )
}

export default MemberModal