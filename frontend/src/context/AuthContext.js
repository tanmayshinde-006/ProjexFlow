import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../config/axios';
import authReducer from '../reducers/authReducer';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on initial render
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/users/me');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/users/register', formData, config);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response.data.message
      });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/users/login', formData, config);

      // Set the auth token before dispatching LOGIN_SUCCESS
      setAuthToken(res.data.token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      // No need to load user again since we have the user data
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.user
      });
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response.data.message
      });
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put('/api/users/profile', formData, config);

      dispatch({
        type: 'UPDATE_PROFILE_SUCCESS',
        payload: res.data.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'UPDATE_PROFILE_FAIL',
        payload: err.response.data.message
      });

      return false;
    }
  };

  // Update password
  const updatePassword = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      await axios.put('/api/users/password', formData, config);

      dispatch({
        type: 'UPDATE_PASSWORD_SUCCESS'
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'UPDATE_PASSWORD_FAIL',
        payload: err.response.data.message
      });

      return false;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        updateProfile,
        updatePassword,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};