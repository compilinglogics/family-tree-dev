import "./ForgotPassword.scss";
import logo from "../../assets/images/logo-white.svg";
import { useState } from "react";
import { postApiRequest } from "../../utils/postRequest";
import { END_POINTS } from "../../common/endPoints";
import { useNavigate } from "react-router-dom";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { toast } from "react-toastify";
import { setLocalStorage } from "../../common/commonFunction/commonFunction";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState(`+${getCountryCallingCode("US")}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    setPhone(e.target.value.trim());
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[0-9]{7,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phone) {
      errors.phone = "Phone number or email is required";
    } else if (!phoneRegex.test(phone) && !emailRegex.test(phone)) {
      errors.phone = "Enter a valid phone number or email address";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const isPhone = /^[0-9]{7,15}$/.test(phone);

    const formData = {
      email: phone,
    };

    if (isPhone) {
      formData.countryCode = countryCode;
    }

    try {
      const response = await postApiRequest(END_POINTS.FORGOT_PASSWORD, formData);
      if (response.success) {
        toast.success("OTP sent successfully!");
        setLocalStorage('phonetemp', phone);
        navigate("/verify-otp");
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = getCountries();

  const getFlagEmoji = (countryCode) =>
    countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));

  const countryOptions = countries.map((code) => {
    const dialCode = `+${getCountryCallingCode(code)}`;
    return {
      code,
      dialCode,
      flag: getFlagEmoji(code),
      value: `${dialCode}-${code}`,
      numericCode: parseInt(getCountryCallingCode(code), 10),
    };
  });

  countryOptions.sort((a, b) => a.numericCode - b.numericCode);

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  return (
    <div className="forgot-password-box bg_secondary">
      <h1 className="forgot-heading">FORGOT PASSWORD</h1>

      <form className="mt-5" onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="phoneNumber">
            Email or Mobile Phone Number
          </label>
          <div className="number-with-conuntry-code d-flex align-items-center mb-4">
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
                id="phoneNumber"
                type="text"
                placeholder="Enter here"
                value={phone}
                onChange={handlePhoneNumberChange}
                className={`border-0 transparent-input login-input form-control phone-number-input ${
                  errors.phone ? "is-invalid" : ""
                }`}
              />
              {errors.phone && (
                <div className="invalid-feedback text-danger">{errors.phone}</div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="login-btn btn-block mb-4 w-100 border-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? "LOADING..." : "CONTINUE"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
