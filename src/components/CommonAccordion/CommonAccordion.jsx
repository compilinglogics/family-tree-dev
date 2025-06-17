import Accordion from 'react-bootstrap/Accordion';
import "./CommonAccordion.scss"
import { Button, Image } from 'react-bootstrap';
import AccordionIcon from '../../assets/images/LeftArrow.svg'
function CommonAccordion() {
  return (
    <Accordion className='common-accordion' defaultActiveKey="0">
      <Accordion.Item className='mb-3 border-0' eventKey="0">
        <Accordion.Header className='border-0'>Lorem ipsum dolor sit amet.

          <Button variant='dark' className='arrow-btn rounded-pill'>
            <Image className="img-fluid" src={AccordionIcon} />
          </Button>
        </Accordion.Header>
        <Accordion.Body className='pt-0'>
          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item className='mb-3 border-0' eventKey="1">
        <Accordion.Header className='border-0'>Lorem ipsum dolor sit amet.

          <Button variant='dark' className='arrow-btn rounded-pill'>
            <Image className="img-fluid" src={AccordionIcon} />
          </Button>
        </Accordion.Header>
        <Accordion.Body className='pt-0'>
          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default CommonAccordion;