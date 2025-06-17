import { Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LeftArroow from '../../assets/images/LeftArrow.svg';

const CommonLine = ({ title }) => {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <div 
            className='d-flex align-items-center text-decoration-none rounded_border bg_secondary p-3 mb-4' 
            style={{ cursor: "pointer" }} 
            onClick={() => navigate(-1)} // Navigate back on click
        >
            <Button variant='dark' className='back-button bg_primary rounded-pill me-3'>
                <Image className='img-fluid' src={LeftArroow} />
            </Button>
            <span className='same_poppins_1'>
                {title}
            </span>
        </div>
    );
};

export default CommonLine;
