import  { useState, useEffect, useRef, useContext } from "react";
import { Form } from "react-bootstrap";
import ProfileSelector from "../ProfileSelector/ProfileSelector";
import { Typeahead } from "react-bootstrap-typeahead";
import { getUser } from "../../utils/getUser";
import { getApiRequest } from "../../utils/getApiRequest";
import { END_POINTS } from "../../common/endPoints";
import PropTypes from "prop-types";

const countries = ["US", "Canada"];
const cities = ["Washington", "New York"];


const EditMember = ({ userId, handleSubmit, handleClose }) => {
  EditMember.propTypes = {
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    userId: PropTypes.string,
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const [relation, setRelation] = useState([]);
  const [isLinked, setIsLinked] = useState(false);
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState([]);
  const [countryCode, setCountryCode] = useState("+1");
  const [city, setCity] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [childrenOptions, setChildrenOptions] = useState([]);
  // const [selectedChildren, setSelectedChildren] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState([]);
  const [formData, setFormData] = useState({
    is_linked: false,
    relationship_type: "",
    additional_data: [],
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    mobileNumber: "",
    country: "",
    city: "",
  });

  const [relationships, setRelationships] = useState([
    "Parent",
    "Child",
    "Sibling",
    "Previous-Partner",
    "Current-Partner",
  ]);
  
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(END_POINTS.GET_USER, userId);
        setFormData({
          is_linked: false,
          relationship_type: "",
          additional_data: [],
          fullName: userData.fullname || "",
          email: userData.email || "",
          dob: userData.dob || "",
          gender: userData.gender || "",
          mobileNumber: userData.phone_number || "",
          country: userData.country || "",
          city: userData.city || "",
        });
        setSelectedImage(userData.image_url);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    getApiRequest(`user/children?id=${userId}`)
      .then((res) => {
        setChildrenOptions(res);
      })
      .catch((error) => {
        console.error("Error fetching children:", error);
      });

    getApiRequest(`user/partners?id=${userId}`)
      .then((res) => {
        setPartnerOptions(res);
      })
      .catch((error) => {
        console.error("Error fetching partners:", error);
      });

    if (user.fid && user.mid) {
      setRelationships((prev) =>
        prev.filter((relationship) => relationship !== "Parent")
      );
    }
  }, [userId]);

  const handleChangeRelation = (e) => {
    setRelation(e);
    setFormData((values) => ({ ...values, relationship_type: e }));
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormData((values) => ({ ...values, image: file }));
    }
  };

  // const handleCheckboxChange = () => {
  //   setIsLinked(!isLinked);
  //   setFormData((values) => ({ ...values, is_linked: !isLinked }));
  // };

  return (
    <form
    encType="multipart/form-data"
      onSubmit={(e) => {
        handleSubmit({ ...formData, id: userId }), e.preventDefault(); // Update this line
      }}
      className="p-4"
    >
      <ProfileSelector
        image={selectedImage}
        handleChange={handleImageChange}
        handleClick={handleImageClick}
        fileRef={fileInputRef}
      />
      <Form.Group className="mb-3">
        <Form.Label>Partner</Form.Label>
        <Typeahead
          id="partner"
          options={partnerOptions.map((partner) => ({
            fullname: partner.fullname,
            id: partner._id,
          }))}
          onChange={(selected) => {
            setSelectedPartner(selected);
            setFormData((values) => ({
              ...values,
              additional_data: selected.map((partner) => partner.id),
            }));
          }}
          labelKey="fullname"
          selected={selectedPartner}
          placeholder="Select partner"
        />
      </Form.Group>
      <div className="form-outline mb-3">
        <label className="form-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          type="text"
          placeholder="Enter here"
          id="fullName"
          className="border-0 sign-up-input form-control"
        />
        {errors.fullName && (
          <div className="invalid-feedback d-block">{errors.fullName}</div>
        )}
      </div>
      <div className="form-outline mb-3">
        <label className="form-label" htmlFor="mobileNumber">
          Mobile Phone Number
        </label>
        <div className="number-with-conuntry-code d-flex align-items-center">
          <select
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="form-select border-0 bg-transparent"
            style={{ maxWidth: "120px", height: "48px" }}
          >
            <option value="+1">+1 (US)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+81">+81 (JP)</option>
          </select>
          <span className="st-line">|</span>
          <div className="phone-number-input-field">
            <input
              id="phone"
              name="mobileNumber"
              type="tel"
              placeholder="Enter here"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={`border-0 transparent-input login-input form-control phone-number-input ${
                errors.mobileNumber ? "is-invalid" : ""
              }`}
            />
          </div>
        </div>
        {errors.mobileNumber && (
          <div className="invalid-feedback d-block">{errors.mobileNumber}</div>
        )}
      </div>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          id="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => {
            const emailValue = e.target.value;
            setEmail(emailValue);
            setFormData((values) => ({ ...values, email: emailValue }));
          }}
          isInvalid={!!errors.email}
        />
        {errors.email && (
          <div className="invalid-feedback d-block">{errors.email}</div>
        )}
      </Form.Group>
      <div className="form-outline mb-3">
        <label className="form-label" htmlFor="dob">
          DOB
        </label>
        <input
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          type="date"
          id="dob"
          className="border-0 sign-up-input form-control"
        />
        {errors.dob && (
          <div className="invalid-feedback d-block">{errors.dob}</div>
        )}
      </div>
      <div className="form-outline mb-3">
        <label className="form-label">Gender</label>
        <div className="d-flex gap-3">
          <Form.Check
            className="grey_dark poppins_font"
            type="radio"
            name="gender"
            label={`Male`}
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          <Form.Check
            className="grey_dark poppins_font"
            type="radio"
            name="gender"
            label={`Female`}
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          <Form.Check
            className="grey_dark poppins_font"
            type="radio"
            name="gender"
            label={`Non-Binary`}
            value="non-binary"
            checked={formData.gender === "non-binary"}
            onChange={handleChange}
          />
        </div>
        {errors.gender && (
          <div className="invalid-feedback d-block">{errors.gender}</div>
        )}
      </div>
      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>
        <Typeahead
          placeholder="Enter here"
          className="search-select-icon border-0"
          id="country"
          labelKey="name"
          onChange={(selected) => handleChange({ target: { name: 'country', value: selected[0] || '' } })}
          options={countries}
          selected={country}
        />
        {errors.country && (
          <div className="invalid-feedback d-block">{errors.country}</div>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Typeahead
          placeholder="Enter here"
          className="search-select-icon border-0"
          id="city"
          labelKey="name"
          onChange={(selected) => handleChange({ target: { name: 'city', value: selected[0] || '' } })}
          options={cities}
          selected={city}
        />
        {errors.city && (
          <div className="invalid-feedback d-block">{errors.city}</div>
        )}
      </Form.Group>
      <div className="d-flex justify-content-center align-items-center gap-3">
        <button
          type="submit"
          className="btn btn-dark btn-lg px-4 rounded-pill shadow-sm"
        >
          Save Changes
        </button>
        <button
          onClick={handleClose}
          className="btn btn-outline-dark btn-lg px-4 rounded-pill shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMember;
