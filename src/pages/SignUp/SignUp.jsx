// import "./SignUp.scss";
// import user from "../../assets/images/people.svg";
// import { Typeahead } from "react-bootstrap-typeahead";
// import "react-bootstrap-typeahead/css/Typeahead.css";
// import { Button, Form, Image, Spinner } from "react-bootstrap";
// import { useEffect, useRef, useState } from "react";
// import { fileUploadApi } from "../../utils/fileUpload";
// import { END_POINTS } from "../../common/endPoints";
// import { toast } from "react-toastify";
// import LeftArroow from '../../assets/images/LeftArrow.svg'
// import ProfileSelector from "../../components/ProfileSelector/ProfileSelector";
// import { Link, useNavigate } from "react-router-dom";

// import { getCountries, getCountryCallingCode } from 'libphonenumber-js';


// const SignUp = () => {
//     const [isDiasbled, setIsDiasbled] = useState(false)
//     const [country, setCountry] = useState([]);
//     const [city, setCity] = useState([]);
//     const [phaseOneCompleted, setPhaseOneCompleted] = useState(false);
//     const cities = ["City 1", "City 2"];
//     const [selectedImage, setSelectedImage] = useState(null);
//     const fileInputRef = useRef(null);
//     const navigate = useNavigate()

//     const handleImageClick = () => {
//         fileInputRef.current.click();
//     };

//     useEffect(() => {
//         setIsDiasbled(false)
//     }, [city, country])

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//         }
//     };

//     const [formData, setFormData] = useState({
//         email: "",
//         countryCode: "+91",
//         phone: "",
//         fullName: "",
//         dob: "",
//         gender: "",
//         password: "",
//         confirmPassword: "",
//         acceptTerms: false,
//     });
//     const [errors, setErrors] = useState({});

//     const handleChange = (event) => {
//         const name = event.target.name;
//         const value =
//             event.target.type === "checkbox"
//                 ? event.target.checked
//                 : event.target.value;
//         setFormData((values) => ({ ...values, [name]: value }));
//     };

//     const validateForm = () => {
//         let formErrors = {};
//         if (!formData.fullName) formErrors.fullName = "Full Name is required";
//         if (!formData.phone.trim()) {
//             formErrors.phone = "Mobile number is required";
//         } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
//             formErrors.phone = "Invalid mobile number format";
//         }
//         if (!formData.email) formErrors.email = "Email is required";
//         if (!formData.dob) formErrors.dob = "Date of Birth is required";
//         if (!formData.gender) formErrors.gender = "Please select your gender";

//         setErrors(formErrors);
//         console.log("formErrors", formErrors);
//         return Object.keys(formErrors).length === 0;
//     };

//     const handleContinue = () => {
//         if (validateForm()) {
//             setPhaseOneCompleted(true);
//         }
//     };

//     const handleSubmit = async (event) => {
//         try {
//             setIsDiasbled(true)
//             event.preventDefault();
//             let formErrors = {};
//             console.log("before validation", formData);
//             console.log("country", country);
//             if (country.length === 0) formErrors.country = "Country is required";
//             if (city.length === 0) formErrors.city = "City is required";
//             if (!formData.password) formErrors.password = "Password is required";
//             if (formData.password !== formData.confirmPassword)
//                 formErrors.confirmPassword = "Passwords do not match";
//             if (!formData.acceptTerms)
//                 formErrors.acceptTerms = "You must accept the terms";

//             setErrors(formErrors);

//             if (Object.keys(formErrors).length === 0) {
//                 const form = new FormData();
//                 form.append("email", formData.email);
//                 form.append("password", formData.password);
//                 form.append("fullName", formData.fullName);
//                 form.append("phone", formData.phone);
//                 form.append("dob", formData.dob);
//                 form.append("gender", formData.gender);
//                 form.append("countryCode", countryCode);
//                 form.append("image", selectedImage)
//                 form.append("country", country[0]);
//                 form.append("city", city[0]);

//                 const response = await fileUploadApi(END_POINTS.SIGN_UP, form);
//                 console.log("up ===== >", END_POINTS.SIGN_UP, form);

//                 console.log("response: ", response);
//                 if (response.data.success) {
//                     console.log("response: ", response);
//                     navigate("/verify-otp")
//                     toast.success(response?.data?.message);
//                     setIsDiasbled(false)
//                 } else {
//                     toast.error(response?.data?.message);
//                     setIsDiasbled(false)
//                 }
//             } else {
//                 console.log("Form submission failed due to errors", formErrors);
//                 setIsDiasbled(false)
//             }
//         } catch (error) {
//             console.log("error: ", error);
//             setIsDiasbled(false)
//         }
//     };

//     const countries = getCountries();
//     const [countryCode, setCountryCode] = useState(`+${getCountryCallingCode('US')}`);
//     const getFlagEmoji = (countryCode) =>
//         countryCode
//             .toUpperCase()
//             .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));

//     const countryOptions = countries.map((code) => {
//         const dialCode = `+${getCountryCallingCode(code)}`;
//         return {
//             code,
//             dialCode,
//             flag: getFlagEmoji(code),
//             value: `${dialCode}-${code}`,
//             numericCode: parseInt(getCountryCallingCode(code), 10)
//         };
//     });

//     // Sort by dial code number
//     countryOptions.sort((a, b) => a.numericCode - b.numericCode);

//     const handleCountryCodeChange = (e) => {
//         setCountryCode(e.target.value);
//     };

//     return (
//         <>
//             <h1 className="sign-up-heading">SignUp</h1>
//             {!phaseOneCompleted ? (
//                 <>
//                     <div className="form-outline mb-4">
//                         <label className="form-label" htmlFor="fullName">
//                             Full Name
//                         </label>
//                         <input
//                             name="fullName"
//                             value={formData.fullName}
//                             onChange={handleChange}
//                             type="text"
//                             placeholder="Enter here"
//                             id="fullName"
//                             className="border-0 sign-up-input form-control"
//                         />
//                         {errors.fullName && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.fullName}
//                             </div>
//                         )}
//                     </div>
//                     <div className="mb-4">
//                         <label className="form-label" htmlFor="phoneNumber">
//                             Mobile Phone Number
//                         </label>
//                         <div className="number-with-conuntry-code d-flex align-items-center">
//                             <select
//                                 value={countryCode}
//                                 onChange={handleCountryCodeChange}
//                                 className="form-select border-0 bg-transparent"
//                                 style={{ maxWidth: "150px", height: "48px" }}
//                             >
//                                 {countryOptions.map((country) => (
//                                     <option key={country.dialCode} value={country.dialCode}>
//                                         {country.flag} {country.dialCode} ({country.code})
//                                     </option>
//                                 ))}
//                             </select>

//                             <span className="st-line">|</span>
//                             <div className="phone-number-input-field">
//                                 <input
//                                     id="phone"
//                                     name="phone"
//                                     type="tel"
//                                     placeholder="Enter here"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     className={`border-0 transparent-input login-input form-control phone-number-input ${errors.phone ? "is-invalid" : ""
//                                         }`}
//                                 />
//                             </div>
//                         </div>
//                         {errors.phone && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.phone}
//                             </div>
//                         )}
//                     </div>
//                     <div className="form-outline mb-4">
//                         <label className="form-label" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             type="email"
//                             placeholder="Enter here"
//                             id="email"
//                             className="border-0 sign-up-input form-control"
//                         />
//                         {errors.email && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.email}
//                             </div>
//                         )}
//                     </div>
//                     <div className="form-outline mb-4">
//                         <label className="form-label" htmlFor="dob">
//                             DOB
//                         </label>
//                         <input
//                             name="dob"
//                             value={formData.dob}
//                             onChange={handleChange}
//                             type="date"
//                             id="dob"
//                             className="border-0 sign-up-input form-control"
//                         />
//                         {errors.dob && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.dob}
//                             </div>
//                         )}
//                     </div>
//                     <div className="form-outline mb-4">
//                         <label className="form-label">Gender</label>
//                         <div className="d-flex gap-3">
//                             <Form.Check // prettier-ignore
//                                 className='mb-3 grey_dark poppins_font'
//                                 type="radio"
//                                 name="gender"
//                                 id={`private`}
//                                 label={`Male`}
//                                 value="Male"
//                                 checked={formData.gender === "Male"}
//                                 onChange={handleChange}
//                             />
//                             <Form.Check // prettier-ignore
//                                 className='mb-3 grey_dark poppins_font'
//                                 type="radio"
//                                 name="gender"
//                                 id={`female`}
//                                 label={`Female`}
//                                 value="Female"
//                                 checked={formData.gender === "Female"}
//                                 onChange={handleChange}
//                             />
//                             <Form.Check // prettier-ignore
//                                 className='mb-3 grey_dark poppins_font'
//                                 type="radio"
//                                 name="gender"
//                                 id={`non-binary`}
//                                 label={`non-binary`}
//                                 value="non-binary"
//                                 checked={formData.gender === "non-binary"}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.genderRadio && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.genderRadio}
//                             </div>
//                         )}
//                     </div>
//                     <button
//                         type="button"
//                         className="login-btn btn-block mb-4 w-100 border-0"
//                         onClick={handleContinue}
//                     >
//                         Continue
//                     </button>

//                     <button
//                         type="button"
//                         className="create-account-btn btn-block mb-4 w-100"
//                     >
//                         Login
//                     </button>
//                 </>
//             ) : (
//                 <form>

//                     <Button onClick={() => setPhaseOneCompleted(!phaseOneCompleted)} variant='dark' className='back-button bg_primary rounded-pill me-3'>
//                         <Image className='img-fluid' src={LeftArroow} />
//                     </Button>

//                     <div className="text-center">

//                         <ProfileSelector image={selectedImage} handleChange={handleImageChange} handleClick={handleImageClick} fileRef={fileInputRef} />

//                     </div>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Country</Form.Label>
//                         {/* <Typeahead
//                             placeholder="Enter here"
//                             className="search-select-icon border-0"
//                             id="country"
//                             labelKey="name"
//                             // onChange={setCountry}
//                             onChange={(selected) => {
//                                 if (selected.length > 0) {
//                                   setCountry(selected);
//                                 } else {
//                                   setCountry([]);
//                                 }
//                               }}
//                             options={countries}
//                             selected={country}
//                             allowNew
//                         /> */}
//                         <Form.Control
//                             type="text"
//                             id="country"
//                             placeholder="Enter here"
//                             labelKey="name"
//                             className="search-select-icon border-0"
//                             value={country[0] || ""}
//                             onChange={(e) => setCountry([e.target.value])}
//                         />
//                         {errors.country && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.country}
//                             </div>
//                         )}
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                         <Form.Label>City</Form.Label>
//                         <Form.Control
//                             type="text"
//                             placeholder="Enter here"
//                             className="search-select-icon border-0"
//                             value={city[0] || ""}
//                             onChange={(e) => setCity([e.target.value])}
//                         />
//                         {errors.city && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.city}
//                             </div>
//                         )}
//                     </Form.Group>
//                     <div className="form-outline mb-4">
//                         <label className="form-label" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             type="password"
//                             id="password"
//                             className="border-0 sign-up-input form-control"
//                         />
//                         {errors.password && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.password}
//                             </div>
//                         )}
//                     </div>
//                     <div className="form-outline mb-4">
//                         <label className="form-label" htmlFor="confirmPassword">
//                             Confirm Password
//                         </label>
//                         <input
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             type="password"
//                             id="confirmPassword"
//                             className="border-0 sign-up-input form-control"
//                         />
//                         {errors.confirmPassword && (
//                             <div className="invalid-feedback d-block">
//                                 {errors.confirmPassword}
//                             </div>
//                         )}
//                     </div>
//                     <div>
//                         <Form.Check
//                             type="checkbox"
//                             name="acceptTerms"
//                             checked={formData.acceptTerms}
//                             onChange={handleChange}
//                             className="mb-3"
//                             label={
//                                 <span>
//                                     Accept{" "}
//                                     <Link to="/terms-of-use" target="_blank" className="text-blue-600 underline">
//                                         Terms of Use
//                                     </Link>
//                                 </span>
//                             }
//                         />
//                     </div>
//                     {errors.acceptTerms && (
//                         <div className="invalid-feedback d-block">
//                             {errors.acceptTerms}
//                         </div>
//                     )}
//                     <Button
//                         disabled={isDiasbled}
//                         type="submit"
//                         variant="dark"
//                         onClick={handleSubmit}
//                         className="w-100 login-btn btn-block mb-3 border-0"
//                     >
//                         {isDiasbled ? <Spinner animation="border" size="sm" /> : ""} {" "}
//                         Submit
//                     </Button>
//                     {/* <button
//                         type="submit"
//                         className="login-btn btn-block mb-4 w-100 border-0"
//                         onClick={handleSubmit}
//                     >
//                         Submit
//                     </button> */}
//                 </form>
//             )}</>
//     );
// };

// export default SignUp;




"use client"

import "./SignUp.scss"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { Button, Form, Image, Spinner } from "react-bootstrap"
import { useEffect, useRef, useState } from "react"
import { fileUploadApi } from "../../utils/fileUpload"
import { END_POINTS } from "../../common/endPoints"
import { toast } from "react-toastify"
import LeftArroow from "../../assets/images/LeftArrow.svg"
import ProfileSelector from "../../components/ProfileSelector/ProfileSelector"
import { Link, useNavigate } from "react-router-dom"

import { getCountries, getCountryCallingCode } from "libphonenumber-js"

const SignUp = () => {
  const [isDiasbled, setIsDiasbled] = useState(false)
  const [country, setCountry] = useState([])
  const [city, setCity] = useState([])
  const [phaseOneCompleted, setPhaseOneCompleted] = useState(false)
  const cities = ["City 1", "City 2"]
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    setIsDiasbled(false)
  }, [city, country])

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

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
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value
    setFormData((values) => ({ ...values, [name]: value }))
  }

  const validateForm = () => {
    const formErrors = {}
    if (!formData.fullName) formErrors.fullName = "Full Name is required"
    if (!formData.phone.trim()) {
      formErrors.phone = "Mobile number is required"
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      formErrors.phone = "Invalid mobile number format"
    }
    if (!formData.email) formErrors.email = "Email is required"
    if (!formData.dob) formErrors.dob = "Date of Birth is required"
    if (!formData.gender) formErrors.gender = "Please select your gender"

    setErrors(formErrors)
    console.log("formErrors", formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      setPhaseOneCompleted(true)
    }
  }

  const handleSubmit = async (event) => {
    try {
      setIsDiasbled(true)
      event.preventDefault()
      const formErrors = {}
      console.log("before validation", formData)
      console.log("country", country)
      if (country.length === 0) formErrors.country = "Country is required"
      if (city.length === 0) formErrors.city = "City is required"
      if (!formData.password) formErrors.password = "Password is required"
      if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match"
      if (!formData.acceptTerms) formErrors.acceptTerms = "You must accept the terms"

      setErrors(formErrors)

      if (Object.keys(formErrors).length === 0) {
        const form = new FormData()
        form.append("email", formData.email)
        form.append("password", formData.password)
        form.append("fullName", formData.fullName)
        form.append("phone", formData.phone)
        form.append("dob", formData.dob)
        form.append("gender", formData.gender)
        form.append("countryCode", countryCode)
        form.append("image", selectedImage)
        form.append("country", country[0])
        form.append("city", city[0])

        const response = await fileUploadApi(END_POINTS.SIGN_UP, form)
        console.log("up ===== >", END_POINTS.SIGN_UP, form)

        console.log("response: ", response)
        if (response.data.success) {
          console.log("response: ", response)
          navigate("/verify-otp")
          toast.success(response?.data?.message)
          setIsDiasbled(false)
        } else {
          // Log the full response to debug
          console.log("Error response:", response)
          console.log("Status code:", response?.status)

          // Check for 409 status code (Conflict) which indicates user already exists
          const is409Conflict = response?.status === 409
          const errorMessage = response?.data?.message || ""
          const isAlreadyRegistered =
            is409Conflict ||
            errorMessage.includes("already registered") ||
            (errorMessage.includes("User") && errorMessage.includes("is already registered"))

          console.log("Status code:", response?.status)
          console.log("Is 409 conflict:", is409Conflict)
          console.log("Error message:", errorMessage)
          console.log("Is already registered:", isAlreadyRegistered)

          // Only show toast if it's not the "already registered" error (409 conflict)
          if (!isAlreadyRegistered) {
            toast.error(response?.data?.message)
          } else {
            // Optional: You can add a console log or handle this case differently
            console.log("User already registered (409 conflict) - not showing toast")
          }
          setIsDiasbled(false)
        }
      } else {
        console.log("Form submission failed due to errors", formErrors)
        setIsDiasbled(false)
      }
    } catch (error) {
      console.log("error: ", error)

      // Check if it's an Axios error with response data
      if (error.response && error.response.data) {
        // Show toast for all errors including 409 "already registered"
        const errorMessage = error.response.data?.message || "An error occurred"
        toast.error(errorMessage)

        console.log("Error status:", error.response.status)
        console.log("Error message:", errorMessage)
      } else {
        // Handle other types of errors (network, etc.)
        toast.error("An error occurred during signup")
      }

      setIsDiasbled(false)
    }
  }

  const countries = getCountries()
  const [countryCode, setCountryCode] = useState(`+${getCountryCallingCode("US")}`)
  const getFlagEmoji = (countryCode) =>
    countryCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))

  const countryOptions = countries.map((code) => {
    const dialCode = `+${getCountryCallingCode(code)}`
    return {
      code,
      dialCode,
      flag: getFlagEmoji(code),
      value: `${dialCode}-${code}`,
      numericCode: Number.parseInt(getCountryCallingCode(code), 10),
    }
  })

  // Sort by dial code number
  countryOptions.sort((a, b) => a.numericCode - b.numericCode)

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value)
  }

  return (
    <>
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
            {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="phoneNumber">
              Mobile Phone Number
            </label>
            <div className="number-with-conuntry-code d-flex align-items-center">
              <select
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="form-select border-0 bg-transparent"
                style={{ maxWidth: "150px", height: "48px" }}
              >
                {countryOptions.map((country) => (
                  <option key={country.dialCode} value={country.dialCode}>
                    {country.flag} {country.dialCode} ({country.code})
                  </option>
                ))}
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
            {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
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
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
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
            {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
          </div>
          <div className="form-outline mb-4">
            <label className="form-label">Gender</label>
            <div className="d-flex gap-3">
              <Form.Check // prettier-ignore
                className="mb-3 grey_dark poppins_font"
                type="radio"
                name="gender"
                id={`private`}
                label={`Male`}
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              <Form.Check // prettier-ignore
                className="mb-3 grey_dark poppins_font"
                type="radio"
                name="gender"
                id={`female`}
                label={`Female`}
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              <Form.Check // prettier-ignore
                className="mb-3 grey_dark poppins_font"
                type="radio"
                name="gender"
                id={`non-binary`}
                label={`non-binary`}
                value="non-binary"
                checked={formData.gender === "non-binary"}
                onChange={handleChange}
              />
            </div>
            {errors.genderRadio && <div className="invalid-feedback d-block">{errors.genderRadio}</div>}
          </div>
          <button type="button" className="login-btn btn-block mb-4 w-100 border-0" onClick={handleContinue}>
            Continue
          </button>

          <button type="button" className="create-account-btn btn-block mb-4 w-100">
            Login
          </button>
        </>
      ) : (
        <form>
          <Button
            onClick={() => setPhaseOneCompleted(!phaseOneCompleted)}
            variant="dark"
            className="back-button bg_primary rounded-pill me-3"
          >
            <Image className="img-fluid" src={LeftArroow || "/placeholder.svg"} />
          </Button>

          <div className="text-center">
            <ProfileSelector
              image={selectedImage}
              handleChange={handleImageChange}
              handleClick={handleImageClick}
              fileRef={fileInputRef}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            {/* <Typeahead
                            placeholder="Enter here"
                            className="search-select-icon border-0"
                            id="country"
                            labelKey="name"
                            // onChange={setCountry}
                            onChange={(selected) => {
                                if (selected.length > 0) {
                                  setCountry(selected);
                                } else {
                                  setCountry([]);
                                }
                              }}
                            options={countries}
                            selected={country}
                            allowNew
                        /> */}
            <Form.Control
              type="text"
              id="country"
              placeholder="Enter here"
              labelKey="name"
              className="search-select-icon border-0"
              value={country[0] || ""}
              onChange={(e) => setCountry([e.target.value])}
            />
            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter here"
              className="search-select-icon border-0"
              value={city[0] || ""}
              onChange={(e) => setCity([e.target.value])}
            />
            {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
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
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
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
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>
          <div>
            <Form.Check
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mb-3"
              label={
                <span>
                  Accept{" "}
                  <Link to="/terms-of-use" target="_blank" className="text-blue-600 underline">
                    Terms of Use
                  </Link>
                </span>
              }
            />
          </div>
          {errors.acceptTerms && <div className="invalid-feedback d-block">{errors.acceptTerms}</div>}
          <Button
            disabled={isDiasbled}
            type="submit"
            variant="dark"
            onClick={handleSubmit}
            className="w-100 login-btn btn-block mb-3 border-0"
          >
            {isDiasbled ? <Spinner animation="border" size="sm" /> : ""} Submit
          </Button>
          {/* <button
                        type="submit"
                        className="login-btn btn-block mb-4 w-100 border-0"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button> */}
        </form>
      )}
    </>
  )
}

export default SignUp




