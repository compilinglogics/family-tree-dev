import React from "react";
import "./CommonModal.scss";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

const CommonModal = ({
  show,
  onHide,
  children,
  title,
  subTitle,
  submitBtnTxt,
  hideActions,
  hideFirstAction,
  secondButtonAction,
  success,
  hideTitles,
  hideHeader,
  hideClose,
  className
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      className={`common-modal ${className?className:''}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className={`content-box my-3 ${hideClose?"hideClose":''}`}>
        {!hideHeader && (
          <Modal.Header
            className={`align-items-start gap-3 p-0 border-0 ${
              success ? "success" : ""
            }`}
            closeButton
          >
            {!hideTitles && (
              <div>
                <span className="title d-block mb-3">{title}</span>
                <span className="sub-title d-block mb-3">{subTitle}</span>
              </div>
            )}
          </Modal.Header>
        )}
        <Modal.Body className="p-0">{children}</Modal.Body>
        {!hideActions && (
          <Modal.Footer className="flex-row gap-3 border-0 p-0 flex-nowrap">
            {!hideFirstAction && (
              <Button
                variant="transparent"
                className="cancel m-0 d-block w-100 rounded-pill"
                onClick={onHide}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="dark"
              className="submit m-0 d-block w-100 rounded-pill"
              onClick={secondButtonAction}
            >
              {submitBtnTxt ? submitBtnTxt : "Submit"}
            </Button>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  );
};

export default CommonModal;
