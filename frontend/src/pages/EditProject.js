import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { ProjectContext } from '../context/ProjectContext';
import { toast } from 'react-toastify';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, getProject, updateProject } = useContext(ProjectContext);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    getProject(id);
  }, [id]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    }
  }, [project]);

  const { name, description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = await updateProject(id, formData);
    if (updatedProject) {
      navigate(`/projects/${id}`);
      toast.success('Project updated successfully');
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
      <h1 className="mb-4">Edit Project</h1>
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

            <Button variant="primary" type="submit" className="me-2">
              Update Project
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/projects/${id}`)}>
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditProject;