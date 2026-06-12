const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Public (in real app should be Private/Admin)
const createProject = async (req, res, next) => {
    try {
        const { title, description, imageUrl, liveLink, githubLink, technologies } = req.body;

        if (!title || !description) {
            res.status(400);
            throw new Error('Please add title and description');
        }

        const project = await Project.create({
            title,
            description,
            imageUrl,
            liveLink,
            githubLink,
            technologies
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    createProject
};
