import "./SignUp.scss";
import logo from "../../assets/images/logo-white.svg";
import user from "../../assets/images/people.svg";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Form } from "react-bootstrap";
import { useRef, useState } from "react";
import { fileUploadApi } from "../../utils/fileUpload";
import { END_POINTS } from "../../common/endPoints";
import { toast } from "react-toastify";

const SignUp = () => {
  const [country, setCountry] = useState([]);
  const [countryCode, setCountryCode] = useState("+1");
  const [city, setCity] = useState([]);
  const [phaseOneCompleted, setPhaseOneCompleted] = useState(false);
  const countries = ["Country 1", "Country 2"];
  const cities = ["City 1", "City 2"];
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); 
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    countryCode: "+91",
    phone: "",
    fullName: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.fullName) formErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) {
      formErrors.phone = "Mobile number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      formErrors.phone = "Invalid mobile number format.";
    }
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.dob) formErrors.dob = "Date of Birth is required";
    if (!formData.gender) formErrors.gender = "Please select your gender";

    setErrors(formErrors);
    console.log("formErrors", formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setPhaseOneCompleted(true);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      let formErrors = {};
      console.log("before validation", formData);
      if (country.length === 0) formErrors.country = "Country is required";
      if (city.length === 0) formErrors.city = "City is required";
      if (!formData.password) formErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword)
        formErrors.confirmPassword = "Passwords do not match";
      if (!formData.acceptTerms)
        formErrors.acceptTerms = "You must accept the terms";

      setErrors(formErrors);

      if (Object.keys(formErrors).length === 0) {
        const form = new FormData();
        form.append("email", formData.email);
        form.append("password", formData.password);
        form.append("fullName", formData.fullName);
        form.append("phone", formData.phone);
        form.append("dob", formData.dob);
        form.append("country", formData.country);
        form.append("gender", formData.gender);
        form.append("city", formData.city);
        form.append("countryCode", formData.countryCode);
        form.append("image", selectedImage)
        const response = await fileUploadApi(END_POINTS.SIGN_UP, form);
        console.log("response: ", response);
        if (response.success) {
          console.log("response: ", response);
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        console.log("Form submission failed due to errors", formErrors);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <section className="sign-up-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div className="logo-place">
              <img src={logo} alt="loading-img" />
            </div>
          </div>
          <div className="col-lg-6 my-4 d-flex justify-content-center align-items-center">
            <div className="sign-up-box">
              <h1 className="sign-up-heading">SignUp</h1>
              {!phaseOneCompleted ? (
                <>
                  <div className="form-outline mb-4">
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
                      <div className="invalid-feedback d-block">
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="phoneNumber">
                      Email or Mobile Phone Number
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
                          name="phone"
                          type="tel"
                          placeholder="Enter here"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`border-0 transparent-input login-input form-control phone-number-input ${
                            errors.phone ? "is-invalid" : ""
                          }`}
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter here"
                      id="email"
                      className="border-0 sign-up-input form-control"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="form-outline mb-4">
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
                      <div className="invalid-feedback d-block">
                        {errors.dob}
                      </div>
                    )}
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label">Gender</label>
                    <div>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                      />{" "}
                      Male
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="ms-3"
                      />{" "}
                      Female
                    </div>
                    {errors.genderRadio && (
                      <div className="invalid-feedback d-block">
                        {errors.genderRadio}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="login-btn btn-block mb-4 w-100"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    className="create-account-btn btn-block mb-4 w-100"
                  >
                    Login
                  </button>
                </>
              ) : (
                <form>
                  <button onClick={() => setPhaseOneCompleted(false)}>
                    back
                  </button>
                  
                  <div className="text-center">
                    <img className="mb-2" onClick={handleImageClick} src={user} alt="loading-img" />
                    <p>Add Profile Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      hidden
                      onChange={handleImageChange}
                      className="form-control"
                    />
                    {selectedImage && (
                      <div>
                        <p>Selected image: {selectedImage.name}</p>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Typeahead
                      placeholder="Enter here"
                      className="search-select-icon border-0"
                      id="country"
                      labelKey="name"
                      onChange={setCountry}
                      options={countries}
                      selected={country}
                    />
                    {errors.country && (
                      <div className="invalid-feedback d-block">
                        {errors.country}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Typeahead
                      placeholder="Enter here"
                      className="search-select-icon border-0"
                      id="city"
                      labelKey="name"
                      onChange={setCity}
                      options={cities}
                      selected={city}
                    />
                    {errors.city && (
                      <div className="invalid-feedback d-block">
                        {errors.city}
                      </div>
                    )}
                  </Form.Group>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      id="password"
                      className="border-0 sign-up-input form-control"
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      id="confirmPassword"
                      className="border-0 sign-up-input form-control"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <div>
                  <Form.Check
                    type="checkbox"
                    label="Accept Terms of Use"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mb-3"
                  />
                  </div>
                  {errors.acceptTerms && (
                    <div className="invalid-feedback d-block">
                      {errors.acceptTerms}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="login-btn btn-block mb-4 w-100"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
