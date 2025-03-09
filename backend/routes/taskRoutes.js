const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  addTaskComment,
  addSubtask,
  updateSubtask,
  getMyTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .post(createTask);

router.route('/me')
  .get(getMyTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Task comment routes
router.route('/:id/comments')
  .post(addTaskComment);

// Task subtask routes
router.route('/:id/subtasks')
  .post(addSubtask);

router.route('/:id/subtasks/:subtaskId')
  .put(updateSubtask);

// Get tasks for a specific project (this route is defined here but will be accessed via /api/projects/:projectId/tasks)
router.route('/project/:projectId')
  .get(getProjectTasks);

module.exports = router;