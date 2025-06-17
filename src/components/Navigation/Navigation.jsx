import "./Navigation.scss";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Form, Nav, Offcanvas, Button, Badge } from "react-bootstrap";
// import Logo from "../../assets/images/Home_Logo.svg";
import Logo from "../../assets/images/newLogo.png";
import HomeDark from "../../assets/icons/navigation/bold/home.svg";
import HomeLight from "../../assets/icons/navigation/light/home.svg";
import TreeLight from "../../assets/icons/navigation/light/tree.svg";
import TreeDark from "../../assets/icons/navigation/bold/tree.svg";
import CalenderLight from "../../assets/icons/navigation/light/note-text.svg";
import CalenderDark from "../../assets/icons/navigation/bold/note-text.svg";
import ChatLight from "../../assets/icons/navigation/light/messages.svg";
import ChatDark from "../../assets/icons/navigation/bold/messages.svg";
import NotificationLight from "../../assets/icons/navigation/light/notification-bing.svg";
import NotificationDark from "../../assets/icons/navigation/bold/notification-bing.svg";
import ProfileImage from "../../assets/icons/navigation/Profile.png";
import CoinBackground from "../../assets/icons/navigation/coinParts/part1.svg";
import MainCoin from "../../assets/icons/navigation/coinParts/part2.svg";
import CenterCoin from "../../assets/icons/navigation/coinParts/part3.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchComments } from "../../store/feature/userSlice";
import { familyTree } from "../../utils/familytreeApi";
import FilterList from "../AddOnComponents/FilterList";
import { getSearchedUser } from "../../utils/getUser";
import { getUser } from "../../utils/Api";

const Navigation = () => {
  const dispatch = useDispatch();
  const user1 = JSON.parse(localStorage.getItem("user"));

  const { user, status, error } = useSelector((state) => state.user?.user);

  const [newUser, setNewUser] = useState();


  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  // Sidebar (Offcanvas) state
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // Fetch family data
  const [familyData, setFamilyData] = useState([]);
  const fetchFamilyData = async () => {
    try {
      const data = await familyTree(user._id);
      setFamilyData(data.relatives);
    } catch (error) {
      console.error("Failed to fetch family data:", error);
    }
  };

  const NewUser = async () => {
    try {
      const data = await getUser(user1._id);
      setNewUser(data.user);
    } catch (error) {
      console.error("Failed to fetch family data:", error);
    }
  };

  useEffect(() => {
    fetchFamilyData();
    NewUser();
  }, []);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchBoxRef = useRef(null);

  const handleSearchOld = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredUsers(
      term.trim() === ""
        ? []
        : familyData.filter((user) =>
          user.fullName.toLowerCase().includes(term.toLowerCase())
        )
    );
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    try {
      const result = await getSearchedUser(term);
      setFilteredUsers(result);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredUsers([]);
    }
  };

  const handleClickOutside = (event) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", lightIcon: HomeLight, darkIcon: HomeDark, route: "/", alt: "Home Icon" },
    { name: "Tree", lightIcon: TreeLight, darkIcon: TreeDark, route: "/tree", alt: "Tree Icon", notificationCount: newUser?.numberOfPendingRequests },
    { name: "Calendar", lightIcon: CalenderLight, darkIcon: CalenderDark, route: "/calendar", alt: "Calendar Icon" },
    { name: "Chat", lightIcon: ChatLight, darkIcon: ChatDark, route: "/chat", alt: "Chat Icon" },
    { name: "Notification", lightIcon: NotificationLight, darkIcon: NotificationDark, route: "/notifications", alt: "Notification Icon", notificationCount: newUser?.notificationCount },
    { name: user?.fullName, lightIcon: user?.profileImageUrl || ProfileImage, darkIcon: user?.profileImageUrl || ProfileImage, route: "/profile", alt: "Profile Icon" },
  ];

  return (
    <Navbar key="xl" expand="xl" className="mb-4 pt-5">
      <div className="navigation-container bg_secondary w-100 px-3 px-md-5">
      <Navbar.Brand className="" as={Link} to="/" style={{ height: '60px' }}>
  <img
    src={Logo}
    alt="Logo"
    style={{
      height: '100%',
      maxHeight: '60px',
      width: 'auto',
      objectFit: 'contain'
    }}
    className="navigation-logo"
  />
</Navbar.Brand>

        {/* Offcanvas Sidebar */}
        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          id={`offcanvasNavbar-expand-xl`}
          aria-labelledby={`offcanvasNavbarLabel-expand-xl`}
          placement="end"
        >
          <Offcanvas.Header closeButton />
          <Offcanvas.Body className="align-items-center">
            {/* Search Box */}
            <div className="row w-100">
              <div className="position-relative col-12 col-12" ref={searchBoxRef}>
                <Form.Control
                  type="search"
                  placeholder="Search users..."
                  className="me-2 navigation-search bg-transparent"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />

                {/* Floating Dropdown for Search Results */}
                {filteredUsers.length > 0 && (
                  <div className="search-results shadow rounded p-2">
                    {filteredUsers.map((user) => (
                      <FilterList user={user} setFilteredUsers={setFilteredUsers} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Links (Desktop) */}
            <Nav className="d-none d-xl-flex justify-content-end pe-xxl-5 ms-auto navigation-controls">
              {menuItems.map((item, index) => (
                <NavLink key={index} to={item.route} className="text-center nav-link">
                  <div className={`position-relative icon-container rounded-pill ${item.name === user?.user?.fullName ? 'profile pb-1' : 'icon'}`}>
                    {/* Light Icon */}
                    <img
                      src={item.lightIcon}
                      className="mx-auto inactive-icon rounded-pill"
                      alt={item.alt}
                    />

                    {/* Notification Badge */}
                    {item.notificationCount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: "0.75rem", padding: "4px 7px" }}
                      >
                        {item.notificationCount}
                      </Badge>
                    )}

                    {/* Dark Icon */}
                    <img
                      src={item.darkIcon}
                      className="mx-auto active-icon rounded-pill"
                      alt={item.alt}
                    />
                  </div>

                  <span className="link-text" style={{ whiteSpace: 'nowrap' }}>{item.name}</span>
                </NavLink>
              ))}
            </Nav>

            {/* Navigation Links (Mobile) */}
            <Nav className="d-block d-xl-none justify-content-end pe-xxl-5 ms-auto navigation-controls flex-wrap">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.route}
                  className="nav-link d-flex align-items-center text-dark rounded py-2 px-3"
                  activeClassName="bg-primary text-white"
                  onClick={handleCloseOffcanvas} // Close sidebar when clicking a nav item
                >
                  <img
                    src={item.lightIcon}
                    alt={`${item.name} Icon`}
                    className="me-3"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* Coins Section */}
        <div className="coin-container ms-auto">
          <img src={CoinBackground} className="image-1 img-fluid" alt="" />
          <img src={MainCoin} className="image-2 img-fluid" alt="" />
          <img src={CenterCoin} className="image-3 img-fluid" alt="" />
          <span className="coin-text">
            {user?.pps?.toFixed(1)} <span className="pp-text">PP</span>
          </span>
        </div>

        {/* Toggle Button */}
        {window.innerWidth < 1200 && (
          <div className="position-relative">
            <Navbar.Toggle
              className="ms-3"
              onClick={handleShowOffcanvas}
              aria-controls="offcanvasNavbar-expand-xl"
            />

            {/* Notification Badge */}
            {newUser?.notificationCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {newUser?.notificationCount}
              </span>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default Navigation;
