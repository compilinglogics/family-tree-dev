import './ChatsCard.scss'
import User from '../../assets/images/Oval.jpg'
import Verified from '../../assets/images/Verified.svg'
import { Button, Image } from 'react-bootstrap'

const ChatsCard = ({user ,  onUserSelect }) => {
    return (
        <div className="chats-card d-flex justify-content-between px-3 align-items-center py-2 mb-3 bg_fourth rounded_border">
            <div className='d-flex gap-2 align-items-center'>
                <Image className='user-img rounded-pill' src={user.profileImageUrl} alt={user.name} />
                <div>

                    <div className="userTitle d-flex align-items-center">
                        {user.fullName}
                        {
                            user.greenTick ? 
                            <Image className='ms-1 verified' src={Verified} />
                            :''
                        }
                      
                    </div>
                    <div className="userSubTitle">
                    {user.country} <br />
                        {user.city}
                    </div>
                </div>
            </div>
            <Button onClick={() => onUserSelect(user)} className='chat_btn rounded-pill' variant='dark'>
                Chat
            </Button>
        </div>
    )
}

export default ChatsCard
