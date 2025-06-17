import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';


export const familyTree = async (Id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/user/relatives/${Id}`);
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

export const addMamber = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/member/add-new-member`, data, {
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

// NOT IN USE
export const getRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/user/get-relation-requests`, {
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

export const confirmRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/member/confirm-relation`, data, {
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
export const confirmRequests_new = async (data,id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/request/update/${id}`, data, {
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

export const getComment = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/post/get-comments`, {
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

export const confirmCommentRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/accept-comment`, data, {
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
export const confirmPostRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/accept-post`, data, {
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
export const confirmFollowRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/follower/accept-reject-request`, data, {
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

export const getSubComment = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/post/get-subcomments`, {
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
export const getNotification = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/post/get-notifications`, {
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

export const confirmSubCommentRequests = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/accept-subcomments`, data, {
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

export const addComment = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/add-comment/${data?.id}`, data, {
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
export const addCommentReply = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/add-subcomment`, data, {
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

export const postLike = async (postID) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.post(`${BASE_URL}/post/like-post/${postID}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const deleteUser = async (userId) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    console.log("token" , token);
    
    try {
        const response = await axios.delete(`${BASE_URL}/user/delete-account/${userId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}