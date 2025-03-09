import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ListGroup, Form } from 'react-bootstrap';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, getTask, updateTask, deleteTask, addTaskComment, addSubtask, updateSubtask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  const [comment, setComment] = useState('');
  const [subtask, setSubtask] = useState({ title: '', completed: false });

  useEffect(() => {
    getTask(id);
  }, [id]);

  const onDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      navigate(`/projects/${task.project}`);
      toast.success('Task deleted successfully');
    }
  };

  const onStatusChange = async (e) => {
    const updatedTask = await updateTask(id, { status: e.target.value });
    if (updatedTask) {
      toast.success('Task status updated');
    }
  };

  const onAddComment = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;

    const success = await addTaskComment(id, comment);
    if (success) {
      setComment('');
      toast.success('Comment added');
    }
  };

  const onAddSubtask = async (e) => {
    e.preventDefault();
    if (subtask.title.trim() === '') return;

    const success = await addSubtask(id, subtask);
    if (success) {
      setSubtask({ title: '', completed: false });
      toast.success('Subtask added');
    }
  };

  const onToggleSubtask = async (subtaskId, completed) => {
    const success = await updateSubtask(id, subtaskId, !completed);
    if (success) {
      toast.success(`Subtask marked as ${!completed ? 'completed' : 'incomplete'}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'to-do':
        return <Badge bg="secondary">To Do</Badge>;
      case 'in-progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'in-review':
        return <Badge bg="info">Review</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">To Do</Badge>;
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
        return <Badge bg="success">Low</Badge>;
    }
  };

  if (!task) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isAssignedToUser = task.assignedTo?._id === user?._id;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{task.title}</h1>
        <div>
          <Button
            as={Link}
            to={`/tasks/${id}/edit`}
            variant="primary"
            className="me-2"
          >
            Edit Task
          </Button>
          <Button variant="danger" onClick={onDeleteTask}>
            Delete Task
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Description</Card.Title>
          <Card.Text>{task.description}</Card.Text>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <div>
              <strong>Status:</strong>{' '}
              {isAssignedToUser ? (
                <Form.Select
                  size="sm"
                  value={task.status}
                  onChange={onStatusChange}
                  style={{ width: 'auto', display: 'inline-block', marginLeft: '0.5rem' }}
                >
                  <option value="to-do">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">Review</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              ) : (
                getStatusBadge(task.status)
              )}
            </div>
            <div>
              <strong>Priority:</strong> {getPriorityBadge(task.priority)}
            </div>
            <div>
              <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
          <div className="mb-3">
            <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
          </div>
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </small>
            {task.updatedAt && (
              <small className="text-muted">
                Updated: {new Date(task.updatedAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Subtasks</h3>
      <Card className="mb-4">
        <Card.Body>
          <ListGroup className="mb-3">
            {task.subtasks && task.subtasks.length > 0 ? (
              task.subtasks.map((subtask) => (
                <ListGroup.Item
                  key={subtask._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Form.Check
                      type="checkbox"
                      id={`subtask-${subtask._id}`}
                      label={subtask.title}
                      checked={subtask.completed}
                      onChange={() => onToggleSubtask(subtask._id, subtask.completed)}
                      disabled={!isAssignedToUser}
                    />
                  </div>
                  <small className="text-muted">
                    {subtask.completed ? 'Completed' : 'Pending'}
                  </small>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No subtasks found.</ListGroup.Item>
            )}
          </ListGroup>

          {isAssignedToUser && (
            <Form onSubmit={onAddSubtask}>
              <Form.Group className="mb-3" controlId="subtaskTitle">
                <Form.Label>Add Subtask</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Enter subtask title"
                    value={subtask.title}
                    onChange={(e) => setSubtask({ ...subtask, title: e.target.value })}
                    required
                  />
                  <Button type="submit" variant="primary" className="ms-2">
                    Add
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Card.Body>
      </Card>

      <h3 className="mb-3">Comments</h3>
      <Card>
        <Card.Body>
          <ListGroup className="mb-3">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <ListGroup.Item key={comment._id}>
                  <div className="d-flex justify-content-between">
                    <strong>{comment.user?.name}</strong>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-0">{comment.text}</p>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No comments yet.</ListGroup.Item>
            )}
          </ListGroup>

          <Form onSubmit={onAddComment}>
            <Form.Group className="mb-3" controlId="commentText">
              <Form.Label>Add Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Post Comment
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskDetails;