import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios"; // Using axios for API requests
import { postApiRequest } from "../utils/postRequest";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const LOGIN_WITH_TOKEN_URL = "auth/login-with-token"; // Single endpoint for validation and refresh
  // const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      loginWithToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = async (savedToken) => {
    console.log("run  loginWithToken");
    
    try {
      const response = await postApiRequest(LOGIN_WITH_TOKEN_URL, { token: savedToken });
      if (!response.error) {
        const { token, user } = response;
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token); // Save new token if refreshed
      }
    } catch (error) {
      console.error("Error logging in with token", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, userDetails) => {
    setToken(token);
    setUser(userDetails);
    console.log(token, userDetails)
    localStorage.setItem("token", token); // Save token in localStorage
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};