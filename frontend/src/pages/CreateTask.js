import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { createTask } = useContext(TaskContext);
  const { project, getProject } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    assignedTo: '',
    project: projectId
  });

  const { title, description, status, priority, dueDate, assignedTo } = formData;

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const task = await createTask(formData);
    if (task) {
      navigate(`/tasks/${task._id}`);
      toast.success('Task created successfully');
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

  return (
    <div>
      <h1 className="mb-4">Create New Task</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter task title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter task description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={status} onChange={onChange}>
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">Review</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={priority} onChange={onChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <br />
              <DatePicker
                selected={dueDate}
                onChange={onDateChange}
                className="form-control"
                dateFormat="MM/dd/yyyy"
                minDate={new Date()}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="assignedTo">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                name="assignedTo"
                value={assignedTo}
                onChange={onChange}
              >
                <option value="">Select a team member</option>
                <option value={user._id}>Myself</option>
                {project.members &&
                  project.members
                    .filter(member => member.user._id !== user._id)
                    .map(member => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </option>
                    ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="me-2">
              Create Task
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateTask;