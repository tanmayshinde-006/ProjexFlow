import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/routing/PrivateRoute';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import TaskDetails from './pages/TaskDetails';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  // Add enhanced-theme class to enable our enhanced UI styles
  return (
    <>
      <Header />
      <div className="main-content enhanced-theme">
        <Container fluid className="py-4 px-4">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects/create" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            <Route path="/projects/:id/edit" element={<PrivateRoute><EditProject /></PrivateRoute>} />
            <Route path="/projects/:projectId/tasks/create" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
            <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path="/tasks/:id/edit" element={<PrivateRoute><EditTask /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;