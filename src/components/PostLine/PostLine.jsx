
import "./PostLine.scss";
import { Button, Container, Dropdown } from 'react-bootstrap';
import SmallAvatar from '../../assets/images/Small-avatar.png'
import ThreeDots from '../../assets/images/3 dots.svg'
import ProfileImage from "../../assets/icons/navigation/Profile.png";
const PostLine = () => {
  return (
    <Container className='my-3'>
      <div className="post-line bg_secondary d-flex justify-content-between align-items-center p-3 ">
        <div className="">
          <img className="avatar me-2 rounded-pill" src={ProfileImage} />
          <span className="ps-1">Rmmbr</span>
        </div>
        <Button className="p-0" variant="transparent">
          <img className="img-fluid" src={ThreeDots} />
        </Button>
      </div>
    </Container>
  )
}

export default PostLine
