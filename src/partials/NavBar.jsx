import React, { useState } from 'react';
import { Navbar, Container, Button, Offcanvas, Modal } from 'react-bootstrap';
import '../styles/NavBar.css'

function NavBar({username,setIsLoggedIn}) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalResults, setModalResults] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = (link) => {
    window.location.href = link;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  }

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:3000/search?string=${encodeURIComponent(search)}`);
    const results = await response.json();

    if (response.ok) {
      setModalResults(results);
      handleShowModal();
    }
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleHideModal = () => {
    setShowModal(false);
  }

  let containers;
  switch (localStorage.getItem('account_type')) {
    case 'member': 
      containers = (
        <>
          <Container className='NavLinks' onClick={() => handleClick("/")}>
            <p>Dashboard</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/profile")}>
            <p>Profile Management</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/schedule")}>
            <p>Schedule Management</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/fitness-goals")}>
            <p>Fitness Goals</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/metrics")}>
            <p>Health Metrics</p>
          </Container>
        </>
      );
      break;

    case 'trainer':
      containers = (
        <>
          <Container className='NavLinks' onClick={() => handleClick("/")}>
            <p>Schedule Management</p>
          </Container>
        </>
      );
      break;

    case 'admin':
      containers = (
        <>
          <Container className='NavLinks' onClick={() => handleClick("/")}>
            <p>Room Booking Management</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/equipment")}>
            <p>Equipment Booking Management</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/classes")}>
            <p>Class Schedule Updating</p>
          </Container>
          <Container className='NavLinks' onClick={() => handleClick("/billing")}>
            <p>Billing and Payment Processing</p>
          </Container>
        </>
      )
  }

  let trainer = localStorage.getItem('account_type') === 'trainer';

  return (
    <>
      <Navbar bg="dark" expand="lg">
        <Container style={{marginLeft: '0px'}}>
          <Button variant="outline-success" onClick={handleShow}>
            Navigation
          </Button>
        </Container>
        {trainer && (<Container style={{marginLeft: '0px', display: 'flex', alignItems: 'center'}}>
            <input type='text' style={{marginLeft: '50%'}} value={search} onChange={handleChange}/>
            <Button onClick={handleSearch}>Search</Button>
        </Container>)}
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} style={{backgroundColor: '#343a40', color: 'white'}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Welcome, {username}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {containers}
          <Container className='NavLinks' onClick={handleLogout}>
            <p>Logout</p>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search - "{search}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalResults.length === 0 ? (
            <p>No Results Found</p>
          ): (
            <ul className='list-group'>
              {modalResults.length !== 0 && modalResults.map((result, index) => {
                return (
                  <li key={index} className='list-group-item'>
                    {result.username}
                  </li>
                );
              })}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleHideModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;