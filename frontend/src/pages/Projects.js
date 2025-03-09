import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const { projects, getProjects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getProjects();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planning':
        return <Badge bg="info">Planning</Badge>;
      case 'in-progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'on-hold':
        return <Badge bg="secondary">On Hold</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge bg="success">Low</Badge>;
      case 'medium':
        return <Badge bg="warning">Medium</Badge>;
      case 'high':
        return <Badge bg="danger">High</Badge>;
      case 'urgent':
        return <Badge bg="danger">Urgent</Badge>;
      default:
        return <Badge bg="success">{priority}</Badge>;
    }
  };

  const isProjectOwner = (project) => {
    return project.members.some(
      member => member.user._id === user?._id && member.role === 'owner'
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Projects</h1>
        <Button as={Link} to="/projects/create" variant="primary">
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p className="mb-3">No projects found.</p>
            <Button as={Link} to="/projects/create" variant="primary">
              Create Your First Project
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {projects.map((project) => (
            <Col key={project._id}>
              <Card className="project-card h-100">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <div className="mb-3">
                    {getStatusBadge(project.status)}{' '}
                    {getPriorityBadge(project.priority)}
                  </div>
                  <div className="mb-3">
                    <strong>Team Members:</strong>
                    <div className="mt-2">
                      {project.members.map((member) => (
                        <Badge
                          key={member.user._id}
                          bg="light"
                          text="dark"
                          className="me-2 mb-2"
                        >
                          {member.user.name}
                          {member.role === 'owner' && (
                            <span className="ms-1">(Owner)</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </small>
                    <Button
                      as={Link}
                      to={`/projects/${project._id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Projects;