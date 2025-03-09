import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="header-nav shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-project-diagram me-2"></i>
          ProjexFlow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  <i className="fas fa-home me-1"></i> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/projects/create" className="nav-link-custom">
                  <i className="fas fa-plus me-1"></i> New Project
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated && user ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="fas fa-user-circle me-1"></i>
                    {user.name}
                  </span>
                } 
                id="user-dropdown" 
                align="end"
                className="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                  <i className="fas fa-user me-2"></i> Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout} className="dropdown-item-custom text-danger">
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom me-2">
                  <i className="fas fa-sign-in-alt me-1"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-btn-custom">
                  <i className="fas fa-user-plus me-1"></i> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;