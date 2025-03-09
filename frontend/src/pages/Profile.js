import React, { useState, useContext, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, updatePassword, error, clearErrors } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [user, error, clearErrors]);

  const { name, email } = profileData;
  const { currentPassword, newPassword, confirmPassword } = passwordData;

  const onProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const onPasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(profileData);
    if (success) {
      setShowProfileSuccess(true);
      setTimeout(() => setShowProfileSuccess(false), 3000);
      toast.success('Profile updated successfully');
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = await updatePassword({
      currentPassword,
      newPassword
    });

    if (success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 3000);
      toast.success('Password updated successfully');
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Profile</h1>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">Update Profile</div>
            <div className="card-body">
              {showProfileSuccess && (
                <div className="alert alert-success">
                  Profile updated successfully!
                </div>
              )}
              <form onSubmit={onProfileSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={onProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={onProfileChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header">Change Password</div>
            <div className="card-body">
              {showPasswordSuccess && (
                <div className="alert alert-success">
                  Password updated successfully!
                </div>
              )}
              <form onSubmit={onPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={onPasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={onPasswordChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={onPasswordChange}
                    required
                    minLength="6"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;