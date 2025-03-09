import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Create context
export const TaskContext = createContext();

// Initial state
const initialState = {
  tasks: [],
  projectTasks: [],
  task: null,
  loading: true,
  error: null
};

// Create reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case 'GET_PROJECT_TASKS':
      return {
        ...state,
        projectTasks: action.payload,
        loading: false
      };
    case 'GET_TASK':
      return {
        ...state,
        task: action.payload,
        loading: false
      };
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        projectTasks: [action.payload, ...state.projectTasks],
        loading: false
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        projectTasks: state.projectTasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        task: action.payload,
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        projectTasks: state.projectTasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'ADD_TASK_COMMENT':
      return {
        ...state,
        task: { ...state.task, comments: [...state.task.comments, action.payload] },
        loading: false
      };
    case 'ADD_SUBTASK':
      return {
        ...state,
        task: { ...state.task, subtasks: [...state.task.subtasks, action.payload] },
        loading: false
      };
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        task: {
          ...state.task,
          subtasks: state.task.subtasks.map(subtask =>
            subtask._id === action.payload._id ? action.payload : subtask
          )
        },
        loading: false
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_TASK':
      return {
        ...state,
        task: null,
        loading: false
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Get all tasks assigned to current user
  const getMyTasks = async () => {
    try {
      const res = await axios.get('/api/tasks/me');

      dispatch({
        type: 'GET_TASKS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get tasks for a specific project
  const getProjectTasks = async (projectId) => {
    try {
      const res = await axios.get(`/api/tasks/project/${projectId}`);

      dispatch({
        type: 'GET_PROJECT_TASKS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get single task
  const getTask = async (id) => {
    try {
      const res = await axios.get(`/api/tasks/${id}`);

      dispatch({
        type: 'GET_TASK',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Create task
  const createTask = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/tasks', formData, config);

      dispatch({
        type: 'CREATE_TASK',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return null;
    }
  };

  // Update task
  const updateTask = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/tasks/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return null;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`/api/tasks/${id}`);
      if (response.data.success) {
        dispatch({
          type: 'DELETE_TASK',
          payload: id
        });
        return true;
      }
      return false;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Add comment to task
  const addTaskComment = async (taskId, comment) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/tasks/${taskId}/comments`, { text: comment }, config);

      dispatch({
        type: 'ADD_TASK_COMMENT',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Add subtask
  const addSubtask = async (taskId, subtask) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/tasks/${taskId}/subtasks`, subtask, config);

      dispatch({
        type: 'ADD_SUBTASK',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Update subtask
  const updateSubtask = async (taskId, subtaskId, completed) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `/api/tasks/${taskId}/subtasks/${subtaskId}`,
        { completed },
        config
      );

      dispatch({
        type: 'UPDATE_SUBTASK',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Clear current task
  const clearTask = () => {
    dispatch({ type: 'CLEAR_TASK' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        projectTasks: state.projectTasks,
        task: state.task,
        loading: state.loading,
        error: state.error,
        getMyTasks,
        getProjectTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        addTaskComment,
        addSubtask,
        updateSubtask,
        clearTask,
        clearErrors
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};