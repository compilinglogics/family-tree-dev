import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { UpdateUser } from "../../utils/getUser";
import { toast } from "react-toastify";

export default function InfoTab({ info, onUpdateSuccess }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        // email: "",
        dob: "",
        gender: "",
        location: "",
        age: "",
        bio: ""
    });

    // Sync formData with info when info changes
    useEffect(() => {
        if (info) {
            setFormData({
                // email: info.email || "",
                dob: info.dob ? new Date(info.dob).toISOString().split("T")[0] : "",
                gender: info.gender || "",
                location: info.location || "",
                age: info.age || "",
                bio: info.bio || ""
            });
        }
    }, [info]); // Runs whenever info changes

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            await UpdateUser(formData);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            if (onUpdateSuccess) onUpdateSuccess(formData); // Update parent state
        } catch (error) {
            toast.error(error?.message);
        }
    };

    const formatDateForDisplay = (dob) => {
        if (!dob) return "N/A";
        const date = new Date(dob);
        if (isNaN(date.getTime())) return "Invalid Date";
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    };

    return (
        <>
            <div className="rounded_border bg_secondary py-3 px-3 mb-4">
                {Object.entries(formData).map(([key, value]) => (
                    <div className="d-flex justify-content-between mb-3" key={key}>
                        <span className="same_poppins_2 fs- fw-500">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>
                        {isEditing ? (
                            <Form.Control
                                type={key === "dob" ? "date" : key === "age" ? "number" : "text"}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-50"
                            />
                        ) : (
                            <span className="same_poppins_2 grey_dark">
                                {key === "dob" ? formatDateForDisplay(value) : value}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <Button
                variant={isEditing ? "success" : "dark"}
                className="d-block rounded-pill mx-auto fw-normal min-w-380 py-2 px-5 mb-3"
                onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            >
                {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
        </>
    );
}
