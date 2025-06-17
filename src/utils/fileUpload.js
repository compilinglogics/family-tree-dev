import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';

export const fileUploadApi = async(endPoint, formData) => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const token = getLocalStorageData('token')
    return await axios.post(`${BASE_URL}/${endPoint}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });
}