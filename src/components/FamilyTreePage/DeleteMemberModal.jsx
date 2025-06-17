import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteMemberModal = ({ show, onHide, handleDelete, itemName , userId }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {itemName || "this item"}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
        <Button variant="danger" onClick={()=> handleDelete(userId)}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteMemberModal;
