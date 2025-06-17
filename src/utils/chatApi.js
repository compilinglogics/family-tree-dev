import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllMessages = async (Id) => {
    const token = getLocalStorageData('token')
    try {
        const response = await axios.get(`${BASE_URL}/user/get-conversation`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const reportUser = async (data) => {
    const token = getLocalStorageData('token')
    try {
        const response = await axios.post(`${BASE_URL}/report/report-user`,data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}