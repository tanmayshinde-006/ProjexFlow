import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, getTask, updateTask } = useContext(TaskContext);
  const { projects, getProjects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(),
    assignedTo: ''
  });

  const { title, description, status, priority, dueDate, assignedTo } = formData;

  useEffect(() => {
    getTask(id);
    getProjects();
  }, [id]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        assignedTo: task.assignedTo?._id || ''
      });
    }
  }, [task]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = await updateTask(id, formData);
    if (updatedTask) {
      navigate(`/tasks/${id}`);
      toast.success('Task updated successfully');
    }
  };

  if (!task || !projects) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Find the project that this task belongs to
  const project = projects.find(p => p._id === task.project);

  return (
    <div>
      <h1 className="mb-4">Edit Task</h1>
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
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={priority} onChange={onChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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

            {project && (
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
                      .filter(member => member._id !== user._id)
                      .map(member => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                </Form.Select>
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="me-2">
              Update Task
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditTask;