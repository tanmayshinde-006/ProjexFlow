import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';

const Dashboard = () => {
  const { projects, getProjects, deleteProject } = useContext(ProjectContext);
  const { tasks, getMyTasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getProjects();
    getMyTasks();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'to-do': 'badge-secondary',
      'in-progress': 'badge-warning',
      'in-review': 'badge-info',
      'completed': 'badge-success'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'badge-secondary'}`}>
        {status.replace('-', ' ').replace(/(^\w|\s\w)/g, c => c.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'low': 'badge-success',
      'medium': 'badge-warning',
      'high': 'badge-danger',
      'urgent': 'badge-danger'
    };
    return (
      <span className={`badge ${priorityClasses[priority] || 'badge-success'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <Row className="header-section mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">Dashboard</h1>
            <Link to="/projects/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Create New Project
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="stats-section mb-4">
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h3>Total Projects</h3>
              <div className="number">{projects.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h3>My Tasks</h3>
              <div className="number">{tasks.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h3>Completed Tasks</h3>
              <div className="number">
                {tasks.filter(task => task.status === 'completed').length}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h3>In Progress</h3>
              <div className="number">
                {tasks.filter(task => task.status === 'in-progress').length}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2 className="section-title">My Projects</h2>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Card className="project-card" key={project._id}>
                  <Card.Body>
                    <h3 className="card-title">{project.name}</h3>
                    <p className="card-text">{project.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </small>
                      <div className="d-flex flex-column">
                        {project.members.some(member => member.user._id === user?._id && member.role === 'owner') && (
                          <button
                            className="btn btn-danger btn-sm mb-2"
                            onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm('Are you sure you want to delete this project?')) {
                                deleteProject(project._id);
                              }
                            }}
                          >
                            Delete Project
                          </button>
                        )}
                        <Link
                          to={`/projects/${project._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="empty-state">
                <p>No projects found. Create a new project to get started!</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="section-title">My Tasks</h2>
          <Card>
            <Card.Body>
              {tasks.length > 0 ? (
                <div className="task-list">
                  {tasks.map((task) => (
                    <Link
                      to={`/tasks/${task._id}`}
                      className="task-list-item"
                      key={task._id}
                    >
                      <div className="task-content">
                        <h4 className="task-title mb-2">{task.title}</h4>
                        <p className="task-description mb-2">{task.description}</p>
                        <div className="task-meta">
                          <div className="badges">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                          </div>
                          <small className="task-due-date">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No tasks assigned to you.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;