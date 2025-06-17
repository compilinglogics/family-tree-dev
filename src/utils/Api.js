import axios from 'axios';
import { END_POINTS } from '../common/endPoints';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';

const BASE_URL = import.meta.env.VITE_API_URL;

const loginapi = async (phone, password,countryCode) => {
    console.log('inside login' , phone, password);
    
    try {
        const response = await axios.post(`${BASE_URL}/${END_POINTS.LOGIN}`, { email:phone, password,countryCode });
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const getUser = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/user/get-user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
export const getUserById = async (id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/user/get-details/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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


export const getLinkedAccounts = async (id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    console.log("token" , token);
    
    try {
        const response = await axios.get(`${BASE_URL}/user/get-linked-accounts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

export const ProfileUpdate = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/user/update-profile-image`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

export { loginapi };