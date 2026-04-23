import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

function BasicExample() {
  const user = sessionStorage.getItem('currentUser')
  const role = sessionStorage.getItem('role')
  const userRole = role ? role.toLowerCase() : '';
  const navigate = useNavigate()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    navigate('/')
  }

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Dynamic colors for TopBar inversion
  const navBgColor = isDarkMode ? '#ffffff' : '#000000';
  const linkColor = isDarkMode ? '#000000' : '#ffffff';
  const themeMode = isDarkMode ? 'light' : 'dark';
  const brandColor = isDarkMode ? '#2563eb' : 'gold'; // Blue on white bg, Gold on black bg

  return (
    <>
      <Navbar expand="lg" data-bs-theme={themeMode} style={{ backgroundColor: navBgColor, transition: 'all 0.3s' }}>
        <Container fluid>

          <Navbar.Brand as={Link} to="/" style={{ fontWeight: 700, color: brandColor, transition: 'color 0.3s' }}>
            <i className="fa-solid fa-crown me-2" style={{ color: brandColor }}></i> Prince Men's Wear
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home" style={{color: linkColor}}>Home</Nav.Link>
              <Nav.Link as={Link} to="/newbills" style={{color: linkColor}}>New Bill</Nav.Link>
              <Nav.Link as={Link} to="/viewbills" style={{color: linkColor}}>View Bills</Nav.Link>
              <Nav.Link as={Link} to="/eod" style={{color: linkColor}}>EOD</Nav.Link>
              <Nav.Link as={Link} to="/stocks" style={{color: linkColor}}>Stock Details</Nav.Link>
              <Nav.Link as={Link} to="/staff" style={{color: linkColor}}>Staff</Nav.Link>
              <Nav.Link as={Link} to="/customers" style={{color: linkColor}}>Customer DB</Nav.Link>

              {(userRole === 'admin') && (
                <Nav.Link as={Link} to="/admin" className="fw-bold" style={{color: isDarkMode ? '#1e40af' : '#60a5fa'}}>Admin Panel</Nav.Link>
              )}

              {(userRole === 'superuser') && (
                <Nav.Link as={Link} to="/superuser" className="fw-bold" style={{color: isDarkMode ? '#b45309' : '#facc15'}}>Super User</Nav.Link>
              )}

            </Nav>

            <Nav>
              <NavDropdown
                title={
                  <span style={{ fontWeight: 600, color: linkColor }}>
                    <i
                      className="fa-regular fa-user me-2"
                      style={{ color: linkColor }}
                    ></i>
                     {user}
                  </span>
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={toggleTheme}>
                  <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fa-solid fa-arrow-right-from-bracket me-2 text-danger"></i>Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

          </Navbar.Collapse>

        </Container>
      </Navbar>
    </>
  );
}

export default BasicExample;