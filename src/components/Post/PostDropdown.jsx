import React, { useState } from 'react';
import { Button, Dropdown, Modal, Form } from 'react-bootstrap';
import ThreeDots from "../../assets/images/3 dots.svg";
import { reportUser } from '../../utils/chatApi';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../../utils/postApi';
import { toast } from 'react-toastify';

export default function PostDropdown({ item, page, getApi }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation
    const navigate = useNavigate();
    const [reason, setReason] = useState("");

    const handleReport = async () => {
        try {
            const tempData = {
                reportedAgainst: item.userId._id,
                reason: reason,
            };
            await reportUser(tempData);
            setShowModal(false);
            toast.success("User reported successfully");
        } catch (error) {
            console.error("Error reporting user:", error);
            toast.error("Failed to report user");
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(item._id);
            toast.success("Post deleted successfully");
            setShowDeleteModal(false);
            getApi();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to delete post");
            console.error("Error deleting post:", error);
        }
    };

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleDeleteClose = () => setShowDeleteModal(false);
    const handleDeleteShow = () => setShowDeleteModal(true);

    const updateNavigate = (item) => {
        navigate('/UpdatePost', { state: { item: item } });
    };

    return (
        <>
            <Button className="post-line-btn p-0" variant="transparent">
                <Dropdown>
                    <Dropdown.Toggle
                        variant="transparent"
                        id="dropdown-basic"
                        className="p-0 border-0 no-arrow"
                    >
                        <img className="img-fluid" src={ThreeDots} alt="Options" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {page === "all-post" ? (
                            <>
                                <Dropdown.Item onClick={handleShow}>
                                    Report user
                                </Dropdown.Item>
                                <Dropdown.Item href="#action-3">Block user</Dropdown.Item>
                            </>
                        ) : (
                            <>
                            {
                                
                            }
                                <Dropdown.Item onClick={() => updateNavigate(item)}>Update post</Dropdown.Item>
                                <Dropdown.Item onClick={handleDeleteShow}>Delete post</Dropdown.Item>
                            </>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Button>

            {/* Report User Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Report User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="reportReason">
                            <Form.Label>Reason for Reporting</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your reason here..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleReport} disabled={!reason.trim()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
