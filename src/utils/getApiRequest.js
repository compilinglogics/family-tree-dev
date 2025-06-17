import axios from 'axios';
import { clearLocalStorage, getLocalStorageData } from '../common/commonFunction/commonFunction';
import { toast } from 'react-toastify';


export const getApiRequest = async (END_POINTS) => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const token = getLocalStorageData('token');
    try {
        const response = await axios.get(`${BASE_URL}/${END_POINTS}`, {
            headers: {
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

