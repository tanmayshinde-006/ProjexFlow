import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { ProjectContext } from '../context/ProjectContext';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    priority: 'medium',
    category: 'development'
  });

  const { name, description, startDate, endDate, status, priority, category } = formData;
  const { createProject } = useContext(ProjectContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const project = await createProject(formData);
    if (project) {
      navigate(`/projects/${project._id}`);
      toast.success('Project created successfully');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Create New Project</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter project name"
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
                placeholder="Enter project description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={status}
                onChange={onChange}
                required
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={priority}
                onChange={onChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={category}
                onChange={onChange}
                required
              >
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={startDate}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={endDate}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Project
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateProject;