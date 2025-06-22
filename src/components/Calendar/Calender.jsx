import "./Calender.scss";
import React, { useEffect, useState } from "react";
import MainCalendar from "../../components/MainCalendar/MainCalendar";
import date1oct2024Image from "../../assets/images/postsByDate/1st.jpg";
import date4oct2024Image from "../../assets/images/postsByDate/4th.png";
import date6oct2024Image from "../../assets/images/postsByDate/6th.jpg";
import date9oct2024Image from "../../assets/images/postsByDate/9th.jpg";
import date14oct2024Image from "../../assets/images/postsByDate/14th.jpg";
import date18oct2024Image from "../../assets/images/postsByDate/18th.jpg";
import date23oct2024Image from "../../assets/images/postsByDate/23rd.png";
import date28oct2024Image from "../../assets/images/postsByDate/28th.jpg";
import date31oct2024Image from "../../assets/images/postsByDate/31st.jpg";
import { getPostPhoto } from "../../utils/postApi";

const Calender = () => {
  const [date, setDate] = useState(new Date());
  const [imageData, setImageData] = useState([]);
  const [minYearGap, setMinYearGap] = useState(5);
  const [maxYearGap, setMaxYearGap] = useState(5);

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Array of images with corresponding dates
  const imageData3 = [
    {
      imagesUrl:
        "http://157.173.222.27:3002/api/v1/post/get-file/0010-Flux_Dev_A_majestic_digital_painting_of_Lord_Shiva_sitting_in__1.jpeg",
      date: "2025-02-28T16:57:40.553Z",
    },
    { imagesUrl: date4oct2024Image, date: "2025-03-02" },
    { imagesUrl: date6oct2024Image, date: "2024-12-06" },
    { imagesUrl: date9oct2024Image, date: "2024-12-09" },
    { imagesUrl: date14oct2024Image, date: "2024-10-14" },
    { imagesUrl: date18oct2024Image, date: "2024-10-18" },
    { imagesUrl: date23oct2024Image, date: "2024-10-23" },
    { imagesUrl: date28oct2024Image, date: "2024-10-28" },
    { imagesUrl: date31oct2024Image, date: "2024-10-31" },
  ];

  const callPostApi = async () => {
    try {
      const response = await getPostPhoto();
      if (response.success) {
        setImageData(response.dateWiseImages);
        console.log("response.dateWiseImages", response.dateWiseImages);

        const currentYear = new Date().getFullYear();

        const years = response.dateWiseImages.map((item) =>
          new Date(item.date).getFullYear()
        );

        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        setMinYearGap(currentYear - minYear);
        setMaxYearGap(currentYear - maxYear);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    callPostApi();
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    ); // Uses local timezone
  }

  return (
    <MainCalendar
      className="fullSizeCalendar mt-3"
      defaultView="month"
      onChange={setDate}
      value={date}
      minYear={minYearGap}
      maxYear={maxYearGap}
      tileContent={({ date, view }) => {
        // Format the date to match the array format (YYYY-MM-DD)
        const formattedDate = formatDate(date);

        // Find the image corresponding to the current date
        const imageObj = imageData.find(
          (item) => formatDate(item.date) === formattedDate
        );

        return imageObj ? (
          <span
            className="calendar-tile"
            style={{
              backgroundImage: `url(${imageObj.imagesUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {date.getDate()}
          </span>
        ) : null;
      }}
    />
  );
};

export default Calender;
