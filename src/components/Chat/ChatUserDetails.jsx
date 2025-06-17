import React from 'react'
import Verified from '../../assets/images/Verified.svg'


export default function ChatUserDetails({user}) {
  return (
    <div className="chats-card d-flex justify-content-between px-3 align-items-center py-2 mb-3 bg_fourth rounded_border">
    <div className='d-flex gap-2 align-items-center'>
        {/* <Image className='user-img rounded-pill' src={user?.img} alt={user?.name} /> */}
        <div>

            <div className="userTitle d-flex align-items-center">
                {user?.fullName || "user name"}
                {/* <Image className='ms-1 verified' src={Verified} /> */}
            </div>
            {/* <div className="userSubTitle">
                1970, Hamburg <br />
                Ryan Yamashita
            </div> */}
        </div>
    </div>
   
</div>  )
}
