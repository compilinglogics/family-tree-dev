import React from 'react'
import ChatsCard from './ChatsCard/ChatsCard'

const Chat = () => {
    return (
        <div className='row height-after-nav'>
            <div className='col-md-4'>
                <div className="h-100 bg_secondary border_r_16 p-3 ">
                    <ChatsCard/>
                    <ChatsCard/>
                </div>
            </div>
            <div className='col-md-8'>
                <div className="d-flex align-items-center justify-content-center h-100 bg_secondary border_r_16 p-3 text-center">
                    <h4 className='fw-400'>
                        Your chat list is currently empty. <br />
                        Start a conversation.
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default Chat
