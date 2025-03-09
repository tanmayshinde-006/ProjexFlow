const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    // Add user to request body as project creator
    req.body.createdBy = req.user.id;
    
    // Add user as a project member with owner role
    req.body.members = [{
      user: req.user.id,
      role: 'owner'
    }];
    
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    // Find projects where user is a member
    const projects = await Project.find({
      'members.user': req.user.id
    }).populate({
      path: 'members.user',
      select: 'name email avatar'
    });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'members.user',
        select: 'name email avatar'
      })
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'name email avatar'
        }
      });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is a member of the project
    const isMember = project.members.some(
      member => member.user._id.toString() === req.user.id
    );
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is project owner or admin
    const isOwner = project.members.some(
      member => member.user.toString() === req.user.id && member.role === 'owner'
    );
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }
    
    // Don't allow updating members through this route
    if (req.body.members) {
      delete req.body.members;
    }
    
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is project owner or admin
    const isOwner = project.members.some(
      member => member.user.toString() === req.user.id && member.role === 'owner'
    );
    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: project._id });

    // Delete the project
    await project.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add project member
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user email'
      });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is project owner, manager or admin
    const isAuthorized = project.members.some(
      member => member.user.toString() === req.user.id && 
      (member.role === 'owner' || member.role === 'manager')
    );
    
    if (!isAuthorized && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members to this project'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already a member
    const isMember = project.members.some(
      member => member.user.toString() === user._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }
    
    // Add user to project members
    project.members.push({
      user: user._id,
      role: role || 'member'
    });
    
    await project.save();
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Add project member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Remove project member
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is project owner, manager or admin
    const isAuthorized = project.members.some(
      member => member.user.toString() === req.user.id && 
      (member.role === 'owner' || member.role === 'manager')
    );
    
    if (!isAuthorized && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this project'
      });
    }
    
    // Check if user to remove is the owner
    const isOwner = project.members.some(
      member => member.user.toString() === req.params.userId && member.role === 'owner'
    );
    
    if (isOwner) {
      return res.status(400).json({
        success: false,
        message: 'Project owner cannot be removed'
      });
    }
    
    // Remove user from project members
    project.members = project.members.filter(
      member => member.user.toString() !== req.params.userId
    );
    
    await project.save();
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Remove project member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
// @access  Private
exports.updateProjectProgress = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user is a member of the project
    const isMember = project.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }
    
    const progress = await project.calculateProgress();
    
    res.status(200).json({
      success: true,
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Update project progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};