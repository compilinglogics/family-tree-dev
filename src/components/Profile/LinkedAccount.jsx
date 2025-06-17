import React, { useState, useEffect, useContext } from 'react';
import { getLinkedAccounts } from '../../utils/Api';
import { Link, useNavigate } from 'react-router-dom';
import LeftArrow from '../../assets/images/LeftArrow.svg';
import { Button, Image, Modal, ListGroup, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { loginapi } from '../../utils/Api';  // Assuming you have a login API call
import { getLocalStorageData, setLocalStorage } from '../../common/commonFunction/commonFunction';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FaCheck } from "react-icons/fa";

export default function LinkedAccount() {
  const [showModal, setShowModal] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [accountToSwitch, setAccountToSwitch] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const savedUserDetails = getLocalStorageData("user");
  const storedUser = JSON.parse(savedUserDetails)

  // Fetch linked accounts
  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      try {
        const accounts = await getLinkedAccounts();
        console.log('Fetched Linked Accounts:', accounts);
        setLinkedAccounts(accounts.linkedAccounts);
      } catch (error) {
        console.error('Failed to fetch linked accounts', error);
      }
    };

    fetchLinkedAccounts();
  }, []);

  // Handle showing modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Function to handle account switch
  const handleAccountSwitch = async (account) => {
    console.log("Account to switch:", account);
    setAccountToSwitch(account);
    setShowModal(false);  // Close modal immediately after selecting an account

    // Update localStorage with the selected account's data
    setLocalStorage('token', account.token);
    setLocalStorage('user', JSON.stringify(account));

    login(account.token, account);

    // Show success toast
    toast.success(`You are now logged in as ${account.fullName}!`);

    // You can add additional login-related logic here, such as:
    // - Triggering a login API request with account details
    // - Navigating to a specific page after switching the account
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    navigate('/');  // Navigate to the homepage or desired page
  };

  return (
    <>

      <Link onClick={handleShow} className='d-flex justify-content-between align-items-center rounded_border bg_secondary text-decoration-none py-6 px-3 mb-3'>
        <span className='same_poppins_4 fw-500 fs-6'>
          Linked account
        </span>
        <Button variant='dark' className=' bg_primary rounded-pill small-arrow-btn'>
          <Image className='rotate-180 img-fluid' src={LeftArrow} />
        </Button>
      </Link>

      {/* Modal to show linked accounts */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Linked Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {linkedAccounts?.length > 0 ? (
            <ListGroup>
              {linkedAccounts.map((account, index) => (

                <ListGroup.Item
                  key={index}
                  className="border-0 mb-4 p-0 bg-transparent"
                  onClick={() => handleAccountSwitch(account)}
                >
                  <Card className="p-3 rounded-4 border-0 account-card shadow-sm hover-shadow" style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
                    <Row className="align-items-center">
                      <Col xs={4} className="text-center">
                        <Image
                          src={account.profileImageUrl}
                          roundedCircle
                          alt={account.fullName}
                          width={70}
                          height={70}
                          className="shadow-sm border border-white"
                          style={{ objectFit: 'cover' }}
                        />
                      </Col>

                      <Col xs={7}>
                        <h5 className="fw-semibold text-dark mb-1">{account.fullName}</h5>
                        <small className="text-muted">Email: {account.email}</small>

                        {!account.isLinked && storedUser._id !== account._id && (
                          <>
                            <br />
                            <small className="text-success fw-bold">Click to parent account</small>
                          </>
                        )}

                      </Col>

                      <Col xs={1} className="text-end">
                        {storedUser._id === account._id ? (
                          // ✅ Blue filled circle with check
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              backgroundColor: "#0d6efd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 10
                            }}
                          >
                            <FaCheck color="white" size={12} />
                          </div>
                        ) : (
                          // ⚪ Grey outlined circle
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              border: "2px solid #ccc",
                              marginTop: 10
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </ListGroup.Item>


              ))}
            </ListGroup>
          ) : (
            <p className="text-center">No linked accounts found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Utility function to update localStorage (assuming it's defined somewhere)
// function setLocalStorage(key, value) {
//     if (value) {
//         localStorage.setItem(key, value);
//     } else {
//         localStorage.removeItem(key);
//     }
// }
