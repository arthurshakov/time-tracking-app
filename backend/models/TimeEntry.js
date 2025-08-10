const mongoose = require('mongoose');
const Project = require('./Project');
// const validator = require('validator');

const timeEntrySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    default: 0,
    min: [0, 'Duration cannot be negative'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLegth: 100,
  },
}, {timestamps: true});

timeEntrySchema.post('save', async (doc) => updateProjectDuration(doc));          // Create
timeEntrySchema.post('findOneAndUpdate', async (doc) => updateProjectDuration(doc)); // Update
timeEntrySchema.post('findOneAndDelete', async (doc) => updateProjectDuration(doc));

// Reusable logic
async function updateProjectDuration(entry) {
  if (!entry) return;
  const project = await Project.findById(entry.projectId);
  if (project) await project.updateDuration();
}

const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);

module.exports = TimeEntry;
