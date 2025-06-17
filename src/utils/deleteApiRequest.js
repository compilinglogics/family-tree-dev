import axios from 'axios';
import { getLocalStorageData } from '../common/commonFunction/commonFunction';


export const deleteApiRequest = async (endPoint, id) => {
    const token = getLocalStorageData('token')
    const BASE_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.delete(`${BASE_URL}/${endPoint}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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