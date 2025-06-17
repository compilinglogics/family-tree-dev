import axios from "axios";
import {
  clearLocalStorage,
  getLocalStorageData,
} from "../common/commonFunction/commonFunction";
import { toast } from "react-toastify";

export const getUser = async (endPoint, userId) => {
  const token = getLocalStorageData("token");
  const BASE_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${BASE_URL}/${endPoint}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
    if (error.response.status === 401) {
      toast.error(error.response.data.message);
      clearLocalStorage();
      window.location.href = "/login";
    }
    throw error;
  }
};

export const getSearchedUser = async (text) => {
  const token = getLocalStorageData('token')
  const BASE_URL = import.meta.env.VITE_API_URL;
  try {
      const response = await axios.get(`${BASE_URL}/user/search-user?query=${text}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
  } catch (error) {
      if(error.response.status === 401){
          toast.error(error.response.data.message);
          clearLocalStorage()
          window.location.href='/login'
      }   
      throw error;
  }
}
export const UpdateUser = async (data) => {
  const token = getLocalStorageData('token')
  const BASE_URL = import.meta.env.VITE_API_URL;
  try {
      const response = await axios.put(`${BASE_URL}/user/update-profile`,data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
  } catch (error) {
      if(error.response.status === 401){
          toast.error(error.response.data.message);
          clearLocalStorage()
          window.location.href='/login'
      }   
      throw error;
  }
}
export const privacy = async (data) => {
  const token = getLocalStorageData('token')
  const BASE_URL = import.meta.env.VITE_API_URL;
  try {
      const response = await axios.post(`${BASE_URL}/user/privacy-setting`,data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
  } catch (error) {
      if(error.response.status === 401){
          toast.error(error.response.data.message);
          clearLocalStorage()
          window.location.href='/login'
      }   
      throw error;
  }
}
