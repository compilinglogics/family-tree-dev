import "./ManageNotication.scss";
import CommonLine from "../CommonLine/CommonLine";
import { Form } from "react-bootstrap";
const ManageNotication = () => {

  return (
    <>
      <CommonLine title="Manage Notifications" />

      <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label="Request Notifications"
        className="costumized-switch bg_secondary p-3 rounded_border same_poppins_2"
      />
    </>
  );
};

export default ManageNotication;
