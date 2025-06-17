import React, { useEffect, useState } from 'react'
import { familyTree } from '../../utils/familytreeApi';
import ChatsCard from '../ChatsCard/ChatsCard';

export default function ChatList({onUserSelect}) {
    const [familyData, setFamilyData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchFamilyData = async () => {
        // console.log("useruseruser", user);

        try {
            const data = await familyTree(user._id);
            
            const filteredData = data.relatives.filter(member => member._id !== user._id);
            setFamilyData(filteredData);
            console.log(data.relatives);

        } catch (error) {
            console.error("Failed to fetch family data:", error);
        }
    };
    useEffect(() => {
        fetchFamilyData();
        onUserSelect(familyData[0])
    }, []);
    return (
        <div className='col-md-4'>
            <div className="h-100 bg_secondary border_r_16 p-3 ">
            {familyData.map((user) => (
                <ChatsCard key={user._id} user={user} onUserSelect={onUserSelect} />
        ))}
            </div>
        </div>
    )
}
