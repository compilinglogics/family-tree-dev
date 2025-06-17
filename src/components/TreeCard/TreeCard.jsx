import "./TreeCard.scss";
import AddMemberIcon from "../../assets/images/AddMemberIcon.svg";
import Verified from "../../assets/icons/post/Verified.svg";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const TreeCard = ({
  name,
  image,
  address,
  isVerified = false,
  isSquare = false,
  isRhombus = false,
  isDark = false,
  addMember = false,
  handleClick,
  editClick,
  handleCardClick

}) => {
  return (
    <div
    onClick={handleCardClick}
      className={`tree-card text-center py-3 px-4 ${isDark ? "bg_dark" : "bg_secondary"
        } same_shadow_border position-relative ${isDark ? "isDark" : ""}`}
    >
      <div
        className={`user-avatar d-inline-block mb-3 ${isSquare ? "rounded-circle" : ""
          } ${isRhombus ? "isRhombus" : ""}`}
      >
        <img
          className={`${isSquare ? "rounded-circle" : ""}`}
          src={image}
          alt=""
        />
      </div>
      <Button
      onClick={editClick}
        variant="transparent"
        className=" p-0 position-absolute end-0 me-3 three-dot-button"
      >
        <svg
          width="30"
          height="25"
          viewBox="0 0 30 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="15.3919"
            cy="22.0283"
            r="2.6087"
            transform="rotate(-90 15.3919 22.0283)"
            fill="black"
          />
          <circle
            cx="15.3919"
            cy="12.811"
            r="2.6087"
            transform="rotate(-90 15.3919 12.811)"
            fill="black"
          />
          <circle
            cx="15.3919"
            cy="3.59345"
            r="2.6087"
            transform="rotate(-90 15.3919 3.59345)"
            fill="black"
          />
        </svg>
      </Button>
      <div className="card_content">
        <span className="user-name">
          <span>{name}</span>
          {isVerified && (
            <img className="verified-icon" src={Verified} alt="" />
          )}
        </span>
        <span className="address d-block">{address}</span>
        {addMember && (
          <Button onClick={handleClick} variant="transparent" className="text-center">
            <img src={AddMemberIcon} alt="" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TreeCard;

TreeCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  address: PropTypes.string,
  isVerified: PropTypes.bool,
  isSquare: PropTypes.bool,
  isRhombus: PropTypes.bool,
  isDark: PropTypes.bool,
  addMember: PropTypes.bool,
  handleClick :PropTypes.func
};