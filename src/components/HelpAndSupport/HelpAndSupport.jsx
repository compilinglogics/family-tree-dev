import React from 'react'
import CommonLine from '../CommonLine/CommonLine'
import RequestCard from '../RequestCard/RequestCard'
import User1 from '../../assets/images/reportedAccounts/user1.png'
import CommonAccordion from '../CommonAccordion/CommonAccordion'
import ChatBox from '../Chat/ChatBoxp'


const HelpAndSupport = () => {
    const user = {
        fullName : "Admin",
        _id : "6813c5350a232d4006827363",
    }
    return (
        <>
            <CommonLine title='Help & Support' />
            <div className="d-flex align-items-center justify-content-center h-100 bg_secondary border_r_16 p-3 text-center">
                    {
                        user ?
                        <ChatBox user={user} />
                        :
                    <h4 className='fw-400'>
                        Your chat list is currently empty. <br />
                        Start a conversation.
                    </h4>
                        
                    }
                </div>
            {/* <CommonAccordion/> */}
        </>
    )
}

export default HelpAndSupport
