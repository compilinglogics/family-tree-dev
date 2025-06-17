import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';


export const getAllPost = async (Id,type) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        // const response = await axios.get(`${BASE_URL}/post/get-post/${Id}`);
        const response = await axios.get(`${BASE_URL}/post/relatives-posts?type=${type}`,{
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
export const getAllMyPosts = async (Id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/post/get-post/${Id}`,{
        // const response = await axios.get(`${BASE_URL}/post/relatives-posts`,{
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

export const uploadPost = async (data) => {
    const token = getLocalStorageData("token");
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.post(`${BASE_URL}/post/add-post`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Required for file uploads
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error(error.response?.data?.message);
            clearLocalStorage();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const updatePost = async (data ,postId) => {
    const token = getLocalStorageData("token");
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.post(`${BASE_URL}/post/update-post/${postId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error(error.response?.data?.message);
            clearLocalStorage();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getPost = async (Id) => {
    const token = getLocalStorageData("token");
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.get(`${BASE_URL}/post/${Id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error(error.response?.data?.message);
            clearLocalStorage();
            window.location.href = "/login";
        }
        throw error;
    }
};


export const getUserPost = async (Id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        // const response = await axios.get(`${BASE_URL}/post/get-post/${Id}`);
        const response = await axios.get(`${BASE_URL}/post/get-post/${Id}`,{
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


export const getPostPhoto = async (Id) => {
    const token = getLocalStorageData("token");
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.get(`${BASE_URL}/post/date-wise-images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePost = async (Id) => {
    const token = getLocalStorageData("token");
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.delete(`${BASE_URL}/post/delete/${Id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

