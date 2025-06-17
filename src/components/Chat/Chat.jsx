import { useState } from 'react';
import ChatsCard from '../ChatsCard/ChatsCard'
import ChatBox from './ChatBox'
import ChatList from './ChatList'

const Chat = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId); 

    console.log("userId" , userId);
    
  };
 
    return (
        <div className='row height-after-nav'>
            <ChatList onUserSelect={handleSelectUser} />
            <div className='col-md-8'>
                <div className="d-flex align-items-center justify-content-center h-100 bg_secondary border_r_16 p-3 text-center">
                    {
                        selectedUserId ?
                        <ChatBox user={selectedUserId} />
                        :
                    <h4 className='fw-400'>
                        Your chat list is currently empty. <br />
                        Start a conversation.
                    </h4>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default Chat
