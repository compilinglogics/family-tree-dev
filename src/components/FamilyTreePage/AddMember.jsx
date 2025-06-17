// import React, { useState, useRef, useEffect, useContext } from "react";
// import { Form } from 'react-bootstrap';
// import ProfileSelector from '../ProfileSelector/ProfileSelector';
// import { Typeahead } from 'react-bootstrap-typeahead';
// import { getApiRequest } from "../../utils/getApiRequest";
// import { END_POINTS } from "../../common/endPoints";
// import { getUser } from "../../utils/getUser";
// // import { useDebounce } from "use-debounce"; // Import the useDebounce hook
// const countries = ["US", "Canada"];
// const cities = ["Washington", "New York"];
// import PropTypes from "prop-types";
// import { getLinkedAccounts } from "../../utils/Api";
// import { Tooltip } from 'bootstrap';

// const AddMember = ({ handleSubmit, handleClose, handleEditSubmit }) => {
//   AddMember.propTypes = {
//     handleClose: PropTypes.func,
//     handleSubmit: PropTypes.func,
//     handleEditSubmit: PropTypes.func,
//   };
//   const [relation, setRelation] = useState([]);
//   const [isLinked, setIsLinked] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));

//   const [email, setEmail] = useState(""); // Keep email as a string

//   const [country, setCountry] = useState([]);
//   const [countryCode, setCountryCode] = useState("+1");
//   const [city, setCity] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [emailSuggestions, setEmailSuggestions] = useState([]);

//   const [childrenOptions, setChildrenOptions] = useState([]); // Options for children
//   const [selectedChildren, setSelectedChildren] = useState([]); // Selected children
//   const [partnerOptions, setPartnerOptions] = useState([]); // Options for partners
//   const [selectedPartner, setSelectedPartner] = useState([]); // Selected partner

//   const [formData, setFormData] = useState({
//     is_linked: false,
//     relationship_type: "",
//     additional_data: [],
//     fullName: "",
//     email: isLinked ? "test@1234eee@gmail.com" : "",
//     dob: "",
//     gender: "",
//     country: "",
//     city: "",
//     password: "123456",
//     countryCode: "",
//   });
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const [relationships, setRelationships] = useState([
//     "Parent",
//     "Child",
//     "Sibling",
//     "Previous-Partner",
//     "Current-Partner",
//   ]);

//   useEffect(() => {
//     getApiRequest(`user/children?id=${user._id}`).then((res) => {
//       setChildrenOptions(res);
//     });

//     getApiRequest(`user/partners?id=${user._id}`).then((res) => {
//       setPartnerOptions(res);
//       console.log('res' , res);
//     });
//     console.log('partnerOptions' , partnerOptions);

//     if (user.fid && user.mid) {
//       setRelationships((prev) =>
//         prev.filter((relationship) => relationship !== "Parent")
//       );
//     }
    
//   }, []);

//   const handleChangeRelation = (e) => {
//     setRelation(e);
//     setFormData((values) => ({ ...values, relationship_type: e }));
//   };

//   const handleCountryCodeChange = (e) => {
//     setCountryCode(e.target.value);
//     setFormData((values) => ({ ...values, countryCode: e.target.value }));
//   };

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleChange = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setFormData((values) => ({ ...values, [name]: value }));
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//       setFormData((values) => ({ ...values, image: file }));
//     }
//   };

//   const handleCheckboxChange = async () => {
//     setIsLinked((prevIsLinked) => {
//       const newIsLinked = !prevIsLinked;
//       setFormData((values) => ({ ...values, is_linked: newIsLinked }));
//       return newIsLinked;
//     });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     let userData = null;
//     if (isLinked) {
//       // userData = await getUser(END_POINTS.GET_USER_BY_EMAIL, formData.email); //to check if the user already existed and if they does, then only update  if not create a new account
//     } else {
//       // userData = await getUser(END_POINTS.GET_USER_BY_EMAIL, formData.email); // if no existing user is found then request shouldn't be allowed
//       // if (!userData) {
//       //   setErrors((values) => ({
//       //     ...values,
//       //     email: "No email found to send a request",
//       //   }));
//       //   return;
//       // }
//     }
//     if (validateForm(userData)) {
//       if (isLinked) {
//         setFormData((values) => ({ ...values, is_linked: isLinked }));
//         if (userData) {
//           handleEditSubmit({ ...formData, id: userData._id });
//         } else {
//           const emailParts = user.email.split("@");
//           const username = emailParts[0];
//           const domain = emailParts[1];
//           let modEmail;
          
//           if (linkedAccounts.length === 0) {
//             modEmail = `${username}RMMBR@${domain}`;
//           } else {
//             modEmail = `${username}RMMBR${linkedAccounts.length + 1}@${domain}`;
//           }
//           formData.email = modEmail
//           handleSubmit(formData);
//         }
//       } else {
//         handleSubmit(formData);
//       }
//     }
//   };

//   const validateForm = (userData) => {
//     let formErrors = {};
//     if (!formData.email && !isLinked) formErrors.email = "Email is required";
//     if (!formData.relationship_type)
//       formErrors.relationship_type = "Relationship type is required";

//     if (isLinked && !userData) {
//       if (!formData.fullName) formErrors.fullName = "Full Name is required";
//       if (!formData.dob) formErrors.dob = "Date of Birth is required";
//       if (!formData.gender) formErrors.gender = "Please select your gender";
//       if (!formData.country) formErrors.country = "Country is required";
//       if (!formData.city) formErrors.city = "City is required";
//       if (!formData.password) formErrors.password = "City is required";
//     }

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const validChildrenOptions = childrenOptions.map((child) => ({
//     fullname: child.fullname || "Unknown",
//     id: child._id,
//   }));


//   const [linkedAccounts, setLinkedAccounts] = useState([]);

//   useEffect(() => {
//     const fetchLinkedAccounts = async () => {
//       try {
//         const accounts = await getLinkedAccounts();
//         setLinkedAccounts(accounts.linkedAccounts);
//       } catch (error) {
//         console.error('Failed to fetch linked accounts', error);
//       }
//     };

//     fetchLinkedAccounts();
//   }, []);

//   useEffect(() => {
//     const tooltipTrigger = document.querySelector('[data-bs-toggle="tooltip"]');
//     if (tooltipTrigger) {
//       new Tooltip(tooltipTrigger, {
//         trigger: 'hover focus click',
//       });
//     }
//   }, []);
  
  

//   return (
//     <form onSubmit={submitHandler} className="p-4">
//       <h1 className="sign-up-heading mb-3">Add Member</h1>
//       <Form.Group className="mb-3">
//         <Form.Label>Relation</Form.Label>
//         <Typeahead
//           placeholder="Enter here"
//           className="search-select-icon border-0"
//           id="relation"
//           labelKey="name"
//           onChange={handleChangeRelation}
//           options={relationships}
//           selected={relation}
//         />
//         {errors.relation && (
//           <div className="invalid-feedback d-block">{errors.relation}</div>
//         )}
//       </Form.Group>
      
//       {
//         !isLinked ?
//         <Form.Group className="mb-3">
//         <Form.Label>Email</Form.Label>
//         <Form.Control
//           id="email"
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => {
//             const emailValue = e.target.value;
//             setEmail(emailValue);
//             setFormData((values) => ({ ...values, email: emailValue }));
//           }}
//           isInvalid={!!errors.email} // Highlight field if invalid
//         />
//         {errors.email && (
//           <div className="invalid-feedback d-block">{errors.email}</div>
//         )}
//       </Form.Group>
//       :''

//       }

     

//       {(relation.includes("Previous-Partner") ||
//         relation.includes("Current-Partner")) &&
//         childrenOptions.length > 0 && (
//           <Form.Group className="mb-3">
//             <Form.Label>Children</Form.Label>
//             <Typeahead
//               id="children"
//               multiple
//               options={childrenOptions.map((child) => ({
//                 fullname: child.fullName,
//                 id: child._id,
//               }))}
//               onChange={(selected) => {
//                 setSelectedChildren(selected);
//                 setFormData((values) => ({
//                   ...values,
//                   additional_data: selected
//                     .filter(Boolean)
//                     .map((child) => child.id),
//                 }));
//               }}
//               labelKey="fullname"
//               selected={selectedChildren}
//               placeholder="Select children"
//             />
//           </Form.Group>
//         )}
//       {/* {relation.includes("Child") && partnerOptions.length > 0 && (
//         <Form.Group className="mb-3">
//           <Form.Label>Partner</Form.Label>
//           <Typeahead
//             id="partner"
//             options={partnerOptions.map((partner) => ({
//               fullname: partner.fullname,
//               id: partner._id,
//             }))}
//             onChange={(selected) => {
//               setSelectedPartner(selected);
//               setFormData((values) => ({
//                 ...values,
//                 additional_data: selected.map((partner) => partner.id),
//               }));
//             }}
//             labelKey="fullname"
//             selected={selectedPartner}
//             placeholder="Select partner"
//           />
//         </Form.Group>
//       )} */}

// {relation.includes("Child") && partnerOptions.some(partner => typeof partner.fullName === "string") && (
//   <Form.Group className="mb-3">
//     <Form.Label>Partner</Form.Label>
//     <Typeahead
//       id="partner"
//       options={partnerOptions
//         .filter(partner => typeof partner.fullName === "string")
//         .map(partner => ({
//           fullname: partner.fullName,
//           id: partner._id,
//         }))}
//       onChange={(selected) => {
//         setSelectedPartner(selected);
//         setFormData((values) => ({
//           ...values,
//           additional_data: selected.map(partner => partner.id),
//         }));
//       }}
//       labelKey="fullname"
//       selected={selectedPartner}
//       placeholder="Select partner"
//     />
//   </Form.Group>
// )}

// <div className="form-outline mb-3 d-flex align-items-center gap-1">
//   <Form.Check
//     type="checkbox"
//     id="isLinked"
//     label="Is Linked"
//     checked={isLinked}
//     onChange={handleCheckboxChange}
//     className="poppins_font grey_dark"
//   />
//  <span
//   className="text-primary fw-bold"
//   data-bs-toggle="tooltip"
//   data-bs-placement="top"
//   title="Linked accounts are used for individuals who cannot create an account themselves, such as young children, elderly family members, or deceased relatives, to add them to your family tree hierarchy."
//   style={{ cursor: 'pointer' }}
// >
//   ?
// </span>
// </div>
//       {isLinked && (
//         <>
//           <ProfileSelector
//             image={selectedImage}
//             handleChange={handleImageChange}
//             handleClick={handleImageClick}
//             fileRef={fileInputRef}
//           />
//           <div className="form-outline mb-3">
//             <label className="form-label" htmlFor="fullName">
//               Full Name
//             </label>
//             <input
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               type="text"
//               placeholder="Enter here"
//               id="fullName"
//               className="border-0 sign-up-input form-control"
//             />
//             {errors.fullName && (
//               <div className="invalid-feedback d-block">{errors.fullName}</div>
//             )}
//           </div>
         
        
         
//           <div className="form-outline mb-3">
//             <label className="form-label" htmlFor="dob">
//               DOB
//             </label>
//             <input
//               name="dob"
//               value={formData.dob}
//               onChange={handleChange}
//               type="date"
//               id="dob"
//               className="border-0 sign-up-input form-control"
//             />
//             {errors.dob && (
//               <div className="invalid-feedback d-block">{errors.dob}</div>
//             )}
//           </div>
//           <div className="form-outline mb-3">
//             <label className="form-label">Gender</label>
//             <div className="d-flex gap-3">
//               <Form.Check
//                 className="grey_dark poppins_font"
//                 type="radio"
//                 name="gender"
//                 label={`Male`}
//                 value="male"
//                 checked={formData.gender === "male"}
//                 onChange={handleChange}
//               />
//               <Form.Check
//                 className="grey_dark poppins_font"
//                 type="radio"
//                 name="gender"
//                 label={`Female`}
//                 value="female"
//                 checked={formData.gender === "female"}
//                 onChange={handleChange}
//               />
//               <Form.Check
//                 className="grey_dark poppins_font"
//                 type="radio"
//                 name="gender"
//                 label={`Non-Binary`}
//                 value="non-binary"
//                 checked={formData.gender === "non-binary"}
//                 onChange={handleChange}
//               />
//             </div>
//             {errors.gender && (
//               <div className="invalid-feedback d-block">{errors.gender}</div>
//             )}
//           </div>
//           <Form.Group className="mb-3">
//             <Form.Label>Country</Form.Label>
//             <Form.Control
//               id="country"
//               type="country"
//               name="country"
//               placeholder="Enter country"
//               value={formData.country}
//               onChange={handleChange}
//               isInvalid={!!errors.country}
//             />
//             {errors.country && (
//               <div className="invalid-feedback d-block">{errors.country}</div>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>City</Form.Label>
//             <Form.Control
//               id="city"
//               type="city"
//               name="city"
//               placeholder="Enter city"
//               value={formData.city}
//               onChange={handleChange}
//               isInvalid={!!errors.city}
//             />
//             {errors.city && (
//               <div className="invalid-feedback d-block">{errors.city}</div>
//             )}
//           </Form.Group>
//           {/* <Form.Group className="mb-3">
//             <Form.Label>Country</Form.Label>
//             <Typeahead
//               placeholder="Enter here"
//               className="search-select-icon border-0"
//               id="country"
//               labelKey="name"
//               onChange={(selected) => {
//                 setCountry(selected);
//                 setFormData((values) => ({
//                   ...values,
//                   country: selected[0] || "",
//                 }));
//               }}
//               value={formData.countries}
//               options={countries}
//               selected={country}
//             />
//             {errors.country && (
//               <div className="invalid-feedback d-block">{errors.country}</div>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>City</Form.Label>
//             <Typeahead
//               placeholder="Enter here"
//               className="search-select-icon border-0"
//               id="city"
//               labelKey="name"
//               onChange={(selected) => {
//                 setCity(selected);
//                 setFormData((values) => ({
//                   ...values,
//                   city: selected[0] || "",
//                 }));
//               }}
//               options={cities}
//               selected={city}
//             />
//             {errors.city && (
//               <div className="invalid-feedback d-block">{errors.city}</div>
//             )}
//           </Form.Group> */}
//         </>
//       )}
//       <div className="d-flex justify-content-center align-items-center gap-3">
//         <button
//           type="submit"
//           className="btn btn-dark btn-lg px-4 rounded-pill shadow-sm"
//         >
//           Add Member
//         </button>
//         <button
//           onClick={handleClose}
//           className="btn btn-outline-dark btn-lg px-4 rounded-pill shadow-sm"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default AddMember;





import React, { useState, useRef, useEffect, useContext } from "react";
import { Form } from 'react-bootstrap';
import ProfileSelector from '../ProfileSelector/ProfileSelector';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getApiRequest } from "../../utils/getApiRequest";
import { END_POINTS } from "../../common/endPoints";
import { getUser } from "../../utils/getUser";
// import { useDebounce } from "use-debounce"; // Import the useDebounce hook
const countries = ["US", "Canada"];
const cities = ["Washington", "New York"];
import PropTypes from "prop-types";
import { getLinkedAccounts } from "../../utils/Api";
import { Tooltip } from 'bootstrap';

const AddMember = ({ handleSubmit, handleClose, handleEditSubmit }) => {
  AddMember.propTypes = {
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleEditSubmit: PropTypes.func,
  };
  const [relation, setRelation] = useState([]);
  const [isLinked, setIsLinked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [email, setEmail] = useState(""); // Keep email as a string

  const [country, setCountry] = useState([]);
  const [countryCode, setCountryCode] = useState("+1");
  const [city, setCity] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [emailSuggestions, setEmailSuggestions] = useState([]);

  const [childrenOptions, setChildrenOptions] = useState([]); // Options for children
  const [selectedChildren, setSelectedChildren] = useState([]); // Selected children
  const [partnerOptions, setPartnerOptions] = useState([]); // Options for partners
  const [selectedPartner, setSelectedPartner] = useState([]); // Selected partner
const [showTooltipInfo, setShowTooltipInfo] = useState(false);
const [tooltipClosed, setTooltipClosed] = useState(false);
const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  const [formData, setFormData] = useState({
    is_linked: false,
    relationship_type: "",
    additional_data: [],
    fullName: "",
    email: isLinked ? "test@1234eee@gmail.com" : "",
    dob: "",
    gender: "",
    country: "",
    city: "",
    password: "123456",
    countryCode: "",
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [relationships, setRelationships] = useState([
    "Parent",
    "Child",
    "Sibling",
    "Previous-Partner",
    "Current-Partner",
  ]);

  useEffect(() => {
    getApiRequest(`user/children?id=${user._id}`).then((res) => {
      setChildrenOptions(res);
    });

    getApiRequest(`user/partners?id=${user._id}`).then((res) => {
      setPartnerOptions(res);
      console.log('res' , res);
    });
    console.log('partnerOptions' , partnerOptions);

    if (user.fid && user.mid) {
      setRelationships((prev) =>
        prev.filter((relationship) => relationship !== "Parent")
      );
    }
    
  }, []);

  const handleChangeRelation = (e) => {
    setRelation(e);
    setFormData((values) => ({ ...values, relationship_type: e }));
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    setFormData((values) => ({ ...values, countryCode: e.target.value }));
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

  const handleCheckboxChange = async () => {
    setIsLinked((prevIsLinked) => {
      const newIsLinked = !prevIsLinked;
      setFormData((values) => ({ ...values, is_linked: newIsLinked }));
      return newIsLinked;
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let userData = null;
    if (isLinked) {
      // userData = await getUser(END_POINTS.GET_USER_BY_EMAIL, formData.email); //to check if the user already existed and if they does, then only update  if not create a new account
    } else {
      // userData = await getUser(END_POINTS.GET_USER_BY_EMAIL, formData.email); // if no existing user is found then request shouldn't be allowed
      // if (!userData) {
      //   setErrors((values) => ({
      //     ...values,
      //     email: "No email found to send a request",
      //   }));
      //   return;
      // }
    }
    if (validateForm(userData)) {
      if (isLinked) {
        setFormData((values) => ({ ...values, is_linked: isLinked }));
        if (userData) {
          handleEditSubmit({ ...formData, id: userData._id });
        } else {
          const emailParts = user.email.split("@");
          const username = emailParts[0];
          const domain = emailParts[1];
          let modEmail;
          
          if (linkedAccounts.length === 0) {
            modEmail = `${username}RMMBR@${domain}`;
          } else {
            modEmail = `${username}RMMBR${linkedAccounts.length + 1}@${domain}`;
          }
          formData.email = modEmail
          handleSubmit(formData);
        }
      } else {
        handleSubmit(formData);
      }
    }
  };

  const validateForm = (userData) => {
    let formErrors = {};
    if (!formData.email && !isLinked) formErrors.email = "Email is required";
    if (!formData.relationship_type)
      formErrors.relationship_type = "Relationship type is required";

    if (isLinked && !userData) {
      if (!formData.fullName) formErrors.fullName = "Full Name is required";
      if (!formData.dob) formErrors.dob = "Date of Birth is required";
      if (!formData.gender) formErrors.gender = "Please select your gender";
      if (!formData.country) formErrors.country = "Country is required";
      if (!formData.city) formErrors.city = "City is required";
      if (!formData.password) formErrors.password = "City is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const validChildrenOptions = childrenOptions.map((child) => ({
    fullname: child.fullname || "Unknown",
    id: child._id,
  }));


  const [linkedAccounts, setLinkedAccounts] = useState([]);

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      try {
        const accounts = await getLinkedAccounts();
        setLinkedAccounts(accounts.linkedAccounts);
      } catch (error) {
        console.error('Failed to fetch linked accounts', error);
      }
    };

    fetchLinkedAccounts();
  }, []);

  useEffect(() => {
    const tooltipTrigger = document.querySelector('[data-bs-toggle="tooltip"]');
    if (tooltipTrigger) {
      new Tooltip(tooltipTrigger, {
        trigger: 'hover focus click',
      });
    }
  }, []);
  
  

  return (
    <form onSubmit={submitHandler} className="p-4">
      <h1 className="sign-up-heading mb-3">Add Member</h1>
      <Form.Group className="mb-3">
        <Form.Label>Relation</Form.Label>
        <Typeahead
          placeholder="Enter here"
          className="search-select-icon border-0"
          id="relation"
          labelKey="name"
          onChange={handleChangeRelation}
          options={relationships}
          selected={relation}
        />
        {errors.relation && (
          <div className="invalid-feedback d-block">{errors.relation}</div>
        )}
      </Form.Group>
      
      {
        !isLinked ?
        <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            const emailValue = e.target.value;
            setEmail(emailValue);
            setFormData((values) => ({ ...values, email: emailValue }));
          }}
          isInvalid={!!errors.email} // Highlight field if invalid
        />
        {errors.email && (
          <div className="invalid-feedback d-block">{errors.email}</div>
        )}
      </Form.Group>
      :''

      }

     

      {(relation.includes("Previous-Partner") ||
        relation.includes("Current-Partner")) &&
        childrenOptions.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Children</Form.Label>
            <Typeahead
              id="children"
              multiple
              options={childrenOptions.map((child) => ({
                fullname: child.fullName,
                id: child._id,
              }))}
              onChange={(selected) => {
                setSelectedChildren(selected);
                setFormData((values) => ({
                  ...values,
                  additional_data: selected
                    .filter(Boolean)
                    .map((child) => child.id),
                }));
              }}
              labelKey="fullname"
              selected={selectedChildren}
              placeholder="Select children"
            />
          </Form.Group>
        )}
      {/* {relation.includes("Child") && partnerOptions.length > 0 && (
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
      )} */}

{relation.includes("Child") && partnerOptions.some(partner => typeof partner.fullName === "string") && (
  <Form.Group className="mb-3">
    <Form.Label>Partner</Form.Label>
    <Typeahead
      id="partner"
      options={partnerOptions
        .filter(partner => typeof partner.fullName === "string")
        .map(partner => ({
          fullname: partner.fullName,
          id: partner._id,
        }))}
      onChange={(selected) => {
        setSelectedPartner(selected);
        setFormData((values) => ({
          ...values,
          additional_data: selected.map(partner => partner.id),
        }));
      }}
      labelKey="fullname"
      selected={selectedPartner}
      placeholder="Select partner"
    />
  </Form.Group>
)}

<div className="form-outline mb-3 d-flex align-items-center gap-1 position-relative">
  <Form.Check
    type="checkbox"
    id="isLinked"
    label="Is Linked"
    checked={isLinked}
    onChange={handleCheckboxChange}
    className="poppins_font grey_dark"
  />

  {!tooltipClosed && (
    <div
      className="position-relative"
      onMouseEnter={() => !isTouchDevice && setShowTooltipInfo(true)}
      onMouseLeave={() => !isTouchDevice && setShowTooltipInfo(false)}
      onClick={() => isTouchDevice && setShowTooltipInfo(!showTooltipInfo)}
      style={{ display: "inline-block" }}
    >
      <span
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: "#0d6efd",
          fontSize: "18px",
        }}
      >
        ?
      </span>

      {showTooltipInfo && (
        <div
          className="position-absolute p-2 shadow"
          style={{
            top: "-130px",
            left: "0",
            zIndex: 999,
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "6px",
            width: "240px",
            fontSize: "12px",
          }}
        >
          <div className="d-flex justify-content-between">
            <span style={{ paddingRight: '10px' }}>
              Linked accounts are used for individuals who cannot create an
              account themselves, such as young children, elderly family
              members, or deceased relatives, to add them to your family tree
              hierarchy.
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation(); // prevents toggling from click
                setTooltipClosed(true);
                setShowTooltipInfo(false);
              }}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              ×
            </span>
          </div>
        </div>
      )}
    </div>
  )}
</div>


      {isLinked && (
        <>
          <ProfileSelector
            image={selectedImage}
            handleChange={handleImageChange}
            handleClick={handleImageClick}
            fileRef={fileInputRef}
          />
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
            <Form.Control
              id="country"
              type="country"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
              isInvalid={!!errors.country}
            />
            {errors.country && (
              <div className="invalid-feedback d-block">{errors.country}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              id="city"
              type="city"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              isInvalid={!!errors.city}
            />
            {errors.city && (
              <div className="invalid-feedback d-block">{errors.city}</div>
            )}
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Typeahead
              placeholder="Enter here"
              className="search-select-icon border-0"
              id="country"
              labelKey="name"
              onChange={(selected) => {
                setCountry(selected);
                setFormData((values) => ({
                  ...values,
                  country: selected[0] || "",
                }));
              }}
              value={formData.countries}
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
              onChange={(selected) => {
                setCity(selected);
                setFormData((values) => ({
                  ...values,
                  city: selected[0] || "",
                }));
              }}
              options={cities}
              selected={city}
            />
            {errors.city && (
              <div className="invalid-feedback d-block">{errors.city}</div>
            )}
          </Form.Group> */}
        </>
      )}
      <div className="d-flex justify-content-center align-items-center gap-3">
        <button
          type="submit"
          className="btn btn-dark btn-lg px-4 rounded-pill shadow-sm"
        >
          Add Member
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

export default AddMember;
