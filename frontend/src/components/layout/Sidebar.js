import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Nav className="flex-column sidebar bg-white shadow-sm py-4 px-3">
      <div className="sidebar-header mb-4">
        <h5 className="text-muted mb-3 px-3">Navigation</h5>
      </div>
      <Nav.Link as={Link} to="/" className="nav-link-custom mb-2">
        <i className="fas fa-home me-2"></i>
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/projects/create" className="nav-link-custom mb-2">
        <i className="fas fa-plus-circle me-2"></i>
        New Project
      </Nav.Link>
      <Nav.Link as={Link} to="/profile" className="nav-link-custom mb-2">
        <i className="fas fa-user-cog me-2"></i>
        Profile
      </Nav.Link>
      <div className="sidebar-footer mt-auto pt-4">
        <div className="px-3">
          <small className="text-muted">Project Management Tool v1.0</small>
        </div>
      </div>
    </Nav>
  );
};

export default Sidebar;