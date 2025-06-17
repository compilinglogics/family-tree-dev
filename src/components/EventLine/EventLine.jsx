
import "./EventLine.scss";
import { Button, Container, Dropdown, Form } from 'react-bootstrap';
import SmallAvatar from '../../assets/images/Small-avatar.png'
import ThreeDots from '../../assets/images/3 dots.svg'
import ProfileImage from "../../assets/icons/navigation/Profile.png";
import MainCalendar from "../MainCalendar/MainCalendar";
import { useEffect, useState } from "react";
import CommonModal from "../CommonModal/CommonModal";
import { useNavigate } from "react-router-dom";
import { familyTree } from "../../utils/familytreeApi";
import dummyProfile from "../../assets/images/dummy-profile.jpg"

const EventLine = () => {
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedId, setSelectedId] = useState();
  const navigate = useNavigate();
  
  const disablePastDates = ({ date }) => {
    const today = new Date();
    return date < today.setHours(0, 0, 0, 0);  // Disable all dates before today
  };
  const onSubmit = () => {
    const date_n = new Date(date);

    // Extract year, month, and day
    const year = date_n.getFullYear()
    const month = String(date_n.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date_n.getDate()).padStart(2, '0'); // Ensure two digits for day

    // Combine into desired format
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate)
    console.log(date, 'date');
    console.log("selectedId",selectedId);
    

    navigate('/post', { state: { date: formattedDate, mamberId: selectedId } })
  }
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    const newDate = new Date(value);
    newDate.setFullYear(parseInt(event.target.value));
    onChange(newDate);
  };
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year <= currentYear + 10; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>

    );
  }

  const [familyData, setFamilyData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchFamilyData = async () => {
    console.log("useruseruser", user);

    try {
      const data = await familyTree(user._id);
      setFamilyData(data.relatives);

    } catch (error) {
      console.error("Failed to fetch family data:", error);
    }
  };
  useEffect(() => {
    fetchFamilyData();
  }, []);


  // other mamber post
  const onSubmitMamberDate = () => {
    const date_n = new Date(date);

    // Extract year, month, and day
    const year = date_n.getFullYear()
    const month = String(date_n.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date_n.getDate()).padStart(2, '0'); // Ensure two digits for day

    // Combine into desired format
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate)
    console.log(date, 'date');

    navigate('/post', { state: { date: formattedDate } })
  }

  return (
    <>
      {/* <div className="large-event-line bg_secondary d-flex justify-content-between align-items-center p-3 mb-3">
        <div className="d-flex align-items-center">
        <div className="d-flex align-items-center flex-column">
          <img className="avatar me-2 rounded-pill" src={ProfileImage} />
          <div className="ps-1">

            <span className="address d-block">
              Dallas , US
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center flex-column">
          <img className="avatar me-2 rounded-pill" src={ProfileImage} />
          <div className="ps-1">

            <span className="address d-block">
              Dallas , US
            </span>
          </div>
        </div>
        </div>
        
      </div> */}

      <div className="container my-4">
        <div className="d-flex justify-content-start align-items-center overflow-auto">
          {familyData.map((user) => (
            // <div onClick={() => { setCalendar(true); setSelectedId(user._id) }} key={user.id} className="text-center me-3">
            <div onClick={() => navigate(`/post/${user._id}`)} key={user.id} className="text-center me-3">
              {
                user.profileImageUrl ?
                  <div className="rounded-circle border border-2 border-dark p-1">
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="rounded-circle"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = dummyProfile;
                      }}
                    />

                  </div>
                  : ""
              }
              <small className="d-block mt-1">{user.fullName}</small>
            </div>
          ))}
        </div>
      </div>



      <div onClick={() => setCalendar(true)} className="event-line bg_secondary d-flex justify-content-between align-items-center p-3 ">
        <div className="">
          <img className="avatar me-2 rounded-pill" src={user?.profileImageUrl} />
          <span className="ps-1">{user?.fullName}</span>
        </div>
        <Button className="post-line-btn p-0" variant="transparent">
          <img className="img-fluid" src={ThreeDots} />
        </Button>
      </div>
      <CommonModal className='calendar-modal' title='Event Date' show={calendar} onHide={() => setCalendar(false)} submitBtnTxt="Confirm" secondButtonAction={onSubmit} hideFirstAction hideClose>
        <MainCalendar
        minYear={1000}
        maxYear={10}
          className='mt-3'
          defaultView="month"
          onChange={setDate}
          value={date}
        />
      </CommonModal>
    </>
  )
}

export default EventLine
