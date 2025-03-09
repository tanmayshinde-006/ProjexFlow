import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ListGroup, Form, Modal } from 'react-bootstrap';
import { ProjectContext } from '../context/ProjectContext';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, getProject, deleteProject, addProjectMember, removeProjectMember } = useContext(ProjectContext);
  const { projectTasks, getProjectTasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'member'
  });
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState(null);

  const onMemberFormChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (memberError) setMemberError(null);
  };

  const onAddMember = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!memberForm.email.trim()) {
      setMemberError('Email is required');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberForm.email)) {
      setMemberError('Please enter a valid email address');
      return;
    }
    
    setAddingMember(true);
    setMemberError(null);
    
    try {
      const success = await addProjectMember(id, memberForm.email);
      if (success) {
        setMemberForm({ name: '', email: '', role: 'member' });
        setShowAddMemberModal(false);
        toast.success('Team member added successfully');
      } else {
        setMemberError('Failed to add member. The user may not exist or is already a member.');
      }
    } catch (error) {
      setMemberError('An error occurred while adding the member');
    } finally {
      setAddingMember(false);
    }
  };

  const onRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      const success = await removeProjectMember(id, userId);
      if (success) {
        toast.success('Member removed successfully');
      }
    }
  };

  // Add useEffect to fetch project and project tasks
  useEffect(() => {
    getProject(id);
    getProjectTasks(id);
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'To Do':
        return <Badge bg="secondary">To Do</Badge>;
      case 'In Progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'Review':
        return <Badge bg="info">Review</Badge>;
      case 'Completed':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">To Do</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low':
        return <Badge bg="success">Low</Badge>;
      case 'Medium':
        return <Badge bg="warning">Medium</Badge>;
      case 'High':
        return <Badge bg="danger">High</Badge>;
      default:
        return <Badge bg="success">Low</Badge>;
    }
  };

  if (!project) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if current user is the project owner by looking at the members array
  const isProjectOwner = project.members && project.members.some(
    member => member.user._id === user?._id && member.role === 'owner'
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{project.name}</h1>
        <div>
          <Button
            as={Link}
            to={`/projects/${id}/tasks/create`}
            variant="success"
            className="me-2"
          >
            Add Task
          </Button>
          {isProjectOwner && (
            <>
              <Button
                as={Link}
                to={`/projects/${id}/edit`}
                variant="primary"
                className="me-2"
              >
                Edit Project
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    deleteProject(id);
                    navigate('/projects');
                    toast.success('Project deleted successfully');
                  }
                }}
                className="me-2"
              >
                Delete Project
              </Button>
            </>
          )}
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>{project.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </small>
                {project.updatedAt && (
                  <small className="text-muted">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </small>
                )}
              </div>
            </Card.Body>
          </Card>

          <h2 className="mb-3">Tasks</h2>
          {projectTasks.length > 0 ? (
            <ListGroup className="mb-4">
              {projectTasks.map((task) => (
                <ListGroup.Item
                  key={task._id}
                  action
                  as={Link}
                  to={`/tasks/${task._id}`}
                  className={`task-list-item priority-${task.priority.toLowerCase()}`}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{task.title}</h5>
                    <div>
                      {getStatusBadge(task.status)}{' '}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <p className="mb-1">{task.description}</p>
                  <small>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Card className="mb-4">
              <Card.Body>
                <p>No tasks found for this project.</p>
                <Button
                  as={Link}
                  to={`/projects/${id}/tasks/create`}
                  variant="primary"
                >
                  Create First Task
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
              <h5 className="mb-0">Team Members</h5>
              {isProjectOwner && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAddMemberModal(true)}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Member
                </Button>
              )}
            </Card.Header>
            <ListGroup variant="flush">
              {project.members && project.members.length > 0 ? (
                project.members.map((member) => (
                  <ListGroup.Item
                    key={member.user._id}
                    className="d-flex justify-content-between align-items-center py-3"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="member-avatar me-2">
                          {member.user.name ? member.user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <strong>{member.user.name || 'Unknown Member'}</strong>
                          {member.user._id === project.owner && (
                            <Badge bg="primary" className="ms-2">Owner</Badge>
                          )}
                          <br />
                          <small className="text-muted">{member.user.email}</small>
                        </div>
                      </div>
                    </div>
                    {isProjectOwner && member.user._id !== user?._id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onRemoveMember(member.user._id)}
                        className="d-flex align-items-center"
                      >
                        <i className="bi bi-person-x me-1"></i>
                        Remove
                      </Button>
                    )}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center py-3">
                  <i className="bi bi-people text-muted"></i>
                  <p className="mb-0 mt-2">No members in this project</p>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Add Member Modal */}
      <Modal
        show={showAddMemberModal}
        onHide={() => {
          setShowAddMemberModal(false);
          setMemberForm({ name: '', email: '', role: 'member' });
          setMemberError(null);
        }}
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {memberError && (
            <div className="alert alert-danger" role="alert">
              {memberError}
            </div>
          )}
          <Form onSubmit={onAddMember}>
            <Form.Group className="mb-3" controlId="memberEmail">
              <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={memberForm.email}
                onChange={onMemberFormChange}
                placeholder="Enter member's email"
                required
                disabled={addingMember}
              />
              <Form.Text className="text-muted">
                The user must have an account in the system to be added.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="memberName">
              <Form.Label>Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={memberForm.name}
                onChange={onMemberFormChange}
                placeholder="Enter member's name for your reference"
                disabled={addingMember}
              />
              <Form.Text className="text-muted">
                This is just for your reference. The actual name will be from their account.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="memberRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={memberForm.role}
                onChange={onMemberFormChange}
                required
                disabled={addingMember}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAddMemberModal(false);
                  setMemberForm({ name: '', email: '', role: 'member' });
                  setMemberError(null);
                }}
                disabled={addingMember}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={addingMember}
              >
                {addingMember ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : 'Add Member'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectDetails;