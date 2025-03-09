import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Create context
export const ProjectContext = createContext();

// Initial state
const initialState = {
  projects: [],
  project: null,
  loading: true,
  error: null
};

// Create reducer
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        loading: false
      };
    case 'GET_PROJECT':
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        loading: false
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload._id ? action.payload : project
        ),
        project: action.payload,
        loading: false
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload),
        loading: false
      };
    case 'PROJECT_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_PROJECT':
      return {
        ...state,
        project: null,
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
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Get all projects
  const getProjects = async () => {
    try {
      const res = await axios.get('/api/projects');

      dispatch({
        type: 'GET_PROJECTS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get single project
  const getProject = async (id) => {
    try {
      const res = await axios.get(`/api/projects/${id}`);

      dispatch({
        type: 'GET_PROJECT',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Create project
  const createProject = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/projects', formData, config);

      dispatch({
        type: 'CREATE_PROJECT',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
      return null;
    }
  };

  // Update project
  const updateProject = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/projects/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_PROJECT',
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
      return null;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      
      dispatch({
        type: 'DELETE_PROJECT',
        payload: id
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Add project member
  const addProjectMember = async (projectId, email) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/projects/${projectId}/members`, { email }, config);

      dispatch({
        type: 'UPDATE_PROJECT',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Remove project member
  const removeProjectMember = async (projectId, userId) => {
    try {
      const res = await axios.delete(`/api/projects/${projectId}/members/${userId}`);

      dispatch({
        type: 'UPDATE_PROJECT',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response.data.message
      });
      return false;
    }
  };

  // Clear current project
  const clearProject = () => {
    dispatch({ type: 'CLEAR_PROJECT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        project: state.project,
        loading: state.loading,
        error: state.error,
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        addProjectMember,
        removeProjectMember,
        clearProject,
        clearErrors
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};