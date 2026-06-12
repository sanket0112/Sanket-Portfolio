const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a project title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        imageUrl: {
            type: String,
        },
        liveLink: {
            type: String,
        },
        githubLink: {
            type: String,
        },
        technologies: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
