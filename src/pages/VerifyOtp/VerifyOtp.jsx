import "./VerifyOtp.scss";
import logo from "../../assets/images/logo-white.svg";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { END_POINTS } from "../../common/endPoints";
import { postApiRequest } from "../../utils/postRequest";
import { useNavigate } from "react-router-dom";
import { getLocalStorageData, setLocalStorage } from "../../common/commonFunction/commonFunction";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateOtp = () => {
    if (otp.length !== 4) {
      setError("Please enter a 4-digit OTP.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateOtp()) return;

    setIsSubmitting(true);

    try {
      const payload = { otp };
      const response = await postApiRequest(END_POINTS.VERIFY_OTP, payload);

      if (response.success) {
        setLocalStorage("email", response?.email);
        toast.success("OTP verified successfully!");
        navigate("/update-password");
      } else {
        toast.error(response?.message || "Invalid OTP");
      }

    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 

  const handleResend = async (event) => {
    event.preventDefault();

    const phone =  getLocalStorageData('phonetemp');
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

  return (
    <>
      <h1 className="verify-otp-heading">ENTER CODE</h1>

      <form className="mt-5" onSubmit={handleSubmit}>
        <p>OTP code has been sent to your email and mobile number.</p>

        <div className="otp-input mb-5">
          <OTPInput
            className="otpInput"
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            numInputs={4}
            renderSeparator={<span>{"  "}</span>}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        {error && <p className="error-message text-danger">{error}</p>}

        <button
          type="submit"
          className="login-btn btn-block mb-4 w-100 border-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? "VERIFYING..." : "CONTINUE"}
        </button>
      </form>

      <p onClick={handleResend} className="code text-center">
        Didn’t receive a code?{" "}
        <span className="resend text-decoration-underline">Resend</span>
      </p>
    </>
  );
};

export default VerifyOtp;
