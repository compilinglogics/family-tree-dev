import "./Stories.scss";
import { Container } from "react-bootstrap";
import AddStory from "../../assets/icons/stories/AddStory.png";
import User from "../../assets/icons/stories/User.png";
import User1 from "../../assets/icons/stories/image-1.jpeg";
import User2 from "../../assets/icons/stories/image-2.png";
import User3 from "../../assets/icons/stories/image-3.png";
import User4 from "../../assets/icons/stories/image-4.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import { Pagination, Navigation } from 'swiper/modules';
const users = [
  {
    id: 1,
    name: "Erica Sinclair",
    image: User,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User1,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User2,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User3,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User4,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User3,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User4,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User3,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User4,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User3,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User4,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User3,
  },
  {
    id: 2,
    name: "Erica Sinclair",
    image: User4,
  },
];
const Stories = () => {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const numberArray = [];
    for (let i = 1; i <= 20; i++) {
      numberArray.push(i);
    }
    setNumbers(numberArray);
  }, []);
  const params = {
    spaceBetween: 30,
    slidesPerView: 10,
    onSlideChange: () => console.log("slide change"),
    onSwiper: (swiper) => console.log(swiper),
    breakpoints: {
      1200: {
        slidesPerView: 10,
        spaceBetween: 30,
      },
      992: {
        slidesPerView: 7,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
      0: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
    },
  };
  return (
    <div className="my-4 px-md-2">

        <Swiper
          {...params} modules={[Pagination, Navigation]}
        >
          <SwiperSlide className="text-center">

            <img
              src={AddStory}
              className="img-fluid d-inline-block mb-3 addStoryImage"
              alt="React Bootstrap logo"
            />

            <p className="mb-0 text-truncate myStoryText">My Story </p>
          </SwiperSlide>
          {users.length > 0 &&
            users.map((user, index) => (
              <SwiperSlide className="text-center " key={index}>
                <div className="mx-1">
                  <img
                    src={user.image}
                    className="img-fluid d-inline-block mb-3 story-image rounded-pill"
                    alt="React Bootstrap logo"
                  />
                </div>
                <p className="mb-0 text-truncate storyText">{user.name} </p>
              </SwiperSlide>
            ))}
        </Swiper>
     
    </div>
  );
};

export default Stories;
