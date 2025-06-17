import "./UpdatePassword.scss";
import logo from "../../assets/images/logo-white.svg";
import { useState } from "react";
import { getLocalStorageData } from "../../common/commonFunction/commonFunction";
import { postApiRequest } from "../../utils/postRequest";
import { END_POINTS } from "../../common/endPoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [email] = useState(getLocalStorageData("email"));
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      const formData = {
        newPassword: password,
        confirmPassword: confirmPassword,
        email: email,
      };
      try {
        const response = await postApiRequest(
          END_POINTS.RESET_PASSWORD,
          formData
        );

        if (response.success) {
          console.log("response: ", response);
          toast.success(response?.message);
          navigate("/");
        }
      } catch (error) {
        console.log("error: ", error);
        toast.error(error?.message);
      }
    }
  };

  return (
    <>
                  <h1 className="verify-otp-heading">RESET PASSWORD</h1>
              <form onSubmit={handleSubmit}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter here"
                    id="newPassword"
                    autoComplete="true"
                    className={`border-0 login-input form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter here"
                    id="confirmPassword"
                    autoComplete="true"
                    className={`border-0 login-input form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-btn btn-block mb-4 w-100 border-0"
                >
                  Submit
                </button>
              </form>
    </>
  );
};

export default UpdatePassword;
