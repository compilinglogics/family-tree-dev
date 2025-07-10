import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { addMamber } from "../../utils/familytreeApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

import { Modal, Button } from "react-bootstrap";

export default function AddMember() {
  // const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const myTreeData = useSelector((store) => store.treeData);
  const id = user?.uid;
  const myTreeData0 = [
    {
      id: 0,
      pids: [1],
      name: "Richard",
      gender: "female",
      img: "https://backend.rmmbr.me/api/v1/user/get-image/0859-Screenshot-2024-11-07-at-12.00.04-AM.png",
      dob: "1992-01-01T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      tags: ["female"],
    },
    {
      id: 1,
      pids: [3, 4, 4, null, null, null],
      fid: 2,
      name: "Pankaj Kushwah",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-18T00:00:00.000Z",
      country: "",
      city: "Indore",
      relation: "Current Partner",
      tags: ["male"],
    },
    {
      id: 2,
      pids: [],
      name: "Arvind Kumar gupta",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-17T18:30:00.000Z",
      country: "Bharat",
      city: "Indore",
      relation: "Sibling",
      tags: ["male"],
    },
    {
      id: 3,
      pids: [],
      fid: 2,
      name: "Anand",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-17T18:30:00.000Z",
      country: "Bharat",
      city: "Indore",
      relation: "Parent",
      tags: ["male"],
    },
    {
      id: 4,
      pids: [1],
      name: "Sheetal",
      gender: "female",
      img: "https://cdn.balkan.app/shared/f13.png",
      dob: "2024-10-17T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      relation: "Previous Partner",
      tags: ["female"],
    },
    {
      id: 15,
      pids: [],
      fid: 2,
      name: "arvind new",
      gender: "non-binary",
      img: "https://backend.rmmbr.me/api/v1/user/get-image/0423-Screenshot-2024-10-19-at-1.36.39â\u0080¯AM.png",
      dob: "2024-11-01T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      relation: "Child",
      tags: ["non-binary"],
    },
    {
      id: 16,
      pids: [],
      fid: 2,
      name: "baap",
      gender: "male",
      img: "https://backend.rmmbr.me/api/v1/user/get-image/0423-Screenshot-2024-10-19-at-1.36.39â\u0080¯AM.png",
      dob: "2024-11-01T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      //   relation: "Parent",
      tags: ["baap"],
    },
  ];
  console.log("store", myTreeData);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    dob: "",
    gender: "",
    selectedRelation: "",
  });

  const [relation, setRelation] = useState([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [errors, setErrors] = useState({});

  const linkedAccoutsList = ["Account 1", "Account 2", "Account 3"];
  const countries = ["Country 1", "Country 2"];
  const cities = ["City 1", "City 2"];
  const relationships = [
    "Parent",
    "Current Partner",
    "Previous Partner",
    "Child",
    "Sibling",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create data object based on form inputs
    const data = {
      fullName: formData.fullName,
      linkedAccount: linkedAccounts.length > 0 ? linkedAccounts[0] : "",
      relation: relation.length > 0 ? relation : "",
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      country: country.length > 0 ? country[0] : "",
      city: city.length > 0 ? city[0] : "",
      dob: formData.dob,
      gender: formData.gender,
      rid: id,
    };
    const sand_data = {
      relation: formData.selectedRelation,
      fullName: formData.fullName,
      linkedAccount: linkedAccounts.length > 0 ? linkedAccounts[0] : "",
      mobileNumber: formData.mobileNumber,
      rid: id,
      mid: selectedPartner,
      email: formData.email,
    };

    // Validate inputs (you can extend this)
    const newErrors = {};
    // if (!data.fullName) newErrors.fullName = "Full Name is required";
    // if (!data.mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
    // if (!data.email) newErrors.email = "Email is required";
    // if (!data.gender) newErrors.gender = "Gender is required";
    // if (!data.dob) newErrors.dob = "Date of Birth is required";
    // if (!data.relation) newErrors.relation = "Relation is required";
    // if (!data.linkedAccount) newErrors.linkedAccount = "Linked Account is required";
    // if (!data.country) newErrors.country = "Country is required";
    // if (!data.city) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("this is sand_data", sand_data);
      console.log("this is data", data);
      console.log("full data ", formData);

      // await addMamber(data);
      await addMamber(sand_data);
      toast.success("Member added successfully!");
    } catch (error) {
      toast.error("Failed to add member. Please try again.");
    }
  };

  // const handleChange = (event) => {
  //     const name = event.target.name;
  //     const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // ________________________________________________________
  // ________________________________________________________
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");

  // Filter partners based on relation containing the word "Partner"
  const partnerOptions = myTreeData.filter(
    (person) => person.relation && person.relation.includes("Partner")
  );

  // Check if there are at least two parents in the data
  const parentCount = myTreeData.filter(
    (person) => person.relation && person.relation === "Parent"
  ).length;

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    // Prevent adding more than 2 parents
    if (name === "selectedRelation" && value === "Parent" && parentCount >= 2) {
      alert("You cannot add more than two parents.");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Logic for showing the partner modal when "Child" is selected
    if (name === "selectedRelation" && value === "Child") {
      if (partnerOptions.length === 0) {
        // No partner available, do not show modal
        return;
      } else if (partnerOptions.length === 1) {
        // Automatically select the only available partner
        setSelectedPartner(partnerOptions[0].id);
      } else if (partnerOptions.length > 1) {
        // Show modal if there are 2 or more partners
        setShowPartnerModal(true);
      }
    }

    // Show modal if "Sibling" is selected and there are fewer than 2 parents
    if (name === "selectedRelation" && value === "Sibling") {
      if (parentCount < 2) {
        setShowParentModal(true);
      }
    }
  };

  const handleCancelModal = () => {
    // Reset selectedRelation if user cancels the modal
    setFormData((prev) => ({ ...prev, selectedRelation: "" }));
    setShowPartnerModal(false);
    setShowParentModal(false);
  };

  const handlePartnerSelection = () => {
    console.log("Selected partner ID:", selectedPartner);
    setShowPartnerModal(false);
  };
  return (
    <>
      <div className="rounded_border bg_secondary p-4">
        <form onSubmit={handleSubmit}>
          <h1 className="sign-up-heading mb-3">Add Member</h1>

          {/* <Form.Group className="mb-3">
                        <Form.Label>Relation</Form.Label>
                        <Form.Select
                            className="search-select-icon border-0"
                            id="relation"
                            name="selectedRelation"
                            // onChange={(e) => setRelation(e.target.value)}
                            onChange={handleChange}
                            value={formData.selectedRelation}
                            style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '8px' }}

                        >
                            <option value="">Select a relation</option>
                            {relationships.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Form.Select>
                        {errors.relation && (
                            <div className="invalid-feedback d-block">
                                {errors.relation}
                            </div>
                        )}
                    </Form.Group> */}

          <Form.Group className="mb-3">
            <Form.Label>Select Relation</Form.Label>
            <Form.Select
              className="search-select-icon border-0"
              name="selectedRelation"
              id="relation"
              value={formData.selectedRelation}
              onChange={handleChange}
              style={{
                backgroundColor: "#f1f1f1",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <option value="">Select a relation</option>
              {[
                {
                  label: "Parent",
                  value: "Parent",
                  disabled: parentCount >= 2,
                },
                { label: "Current Partner", value: "Current Partner" },
                { label: "Previous Partner", value: "Previous Partner" },
                { label: "Child", value: "Child" },
                { label: "Sibling", value: "Sibling" },
              ].map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Linked Accounts</Form.Label>
            <Typeahead
              placeholder="Enter here"
              className="search-select-icon border-0"
              id="linkedAccounts"
              labelKey="name"
              onChange={setLinkedAccounts}
              options={linkedAccoutsList}
              selected={linkedAccounts}
            />
            {errors.linkedAccount && (
              <div className="invalid-feedback d-block">
                {errors.linkedAccount}
              </div>
            )}
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
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              type="number"
              placeholder="Enter here"
              id="mobileNumber"
              className="border-0 sign-up-input form-control"
              pattern="[0-9]*" // only allows numbers
              inputMode="numeric" // mobile devices show number keyboard
            />
            {errors.mobileNumber && (
              <div className="invalid-feedback d-block">
                {errors.mobileNumber}
              </div>
            )}
          </div>

          <div className="form-outline mb-3">
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
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          {/* <div className="form-outline mb-3">
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
                            max={new Date().toISOString().split("T")[0]} // restricts to past dates
                        />
                        {errors.dob && (
                            <div className="invalid-feedback d-block">
                                {errors.dob}
                            </div>
                        )}
                    </div>

                    <div className="form-outline mb-3">
                        <label className="form-label">Gender</label>
                        <div className="d-flex gap-3">
                            <Form.Check
                                className='grey_dark poppins_font'
                                type="radio"
                                name="gender"
                                label={`Male`}
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={handleChange}
                            />
                            <Form.Check
                                className='grey_dark poppins_font'
                                type="radio"
                                name="gender"
                                label={`Female`}
                                value="Female"
                                checked={formData.gender === "Female"}
                                onChange={handleChange}
                            />
                            <Form.Check
                                className='grey_dark poppins_font'
                                type="radio"
                                name="gender"
                                label={`non-binary`}
                                value="non-binary"
                                checked={formData.gender === "non-binary"}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.gender && (
                            <div className="invalid-feedback d-block">
                                {errors.gender}
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

                    <Form.Group className="mb-4">
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
                    </Form.Group> */}

          <button
            type="submit"
            className="add_member_btn login-btn btn-block mb-4 px-5 mx-auto"
          >
            Add Member
          </button>
        </form>
      </div>
      {/* ----- */}

      <div>
        {/* Modal for selecting a partner */}
        <Modal show={showPartnerModal} onHide={handleCancelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select Partner</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {partnerOptions.length > 0 ? (
              <Form.Group>
                <Form.Label>Choose a partner:</Form.Label>
                <Form.Select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                >
                  <option value="">Select partner</option>
                  {partnerOptions.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <p>No partners available for selection.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePartnerSelection}
              disabled={!selectedPartner} // Disable button until a partner is selected
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for adding parents */}
        <Modal show={showParentModal} onHide={handleCancelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Insufficient Parents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              At least two parents are required to select "Sibling" as a
              relation. Please add parents first.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
