import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';

export const getFollowers = async (data) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${BASE_URL}/follower/get-followings`, {
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

export const FollowUser = async (id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    console.log("token" , );
    
    try {
        const response = await axios.post(`${BASE_URL}/follower/toggle-follow/${id}`, {},{
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