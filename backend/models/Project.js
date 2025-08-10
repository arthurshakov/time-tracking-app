const mongoose = require('mongoose');
// const validator = require('validator');

const projectSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    default: 0,
    min: [0, 'Duration cannot be negative'],
    set: v => Math.round(v), // Ensure whole numbers
  },
  completed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLegth: 100,
    unique: true,
  },
  // timeEntries: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'TimeEntry',
  // }],
}, {
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

projectSchema.virtual('timeEntries', {
  ref: 'TimeEntry',
  localField: '_id',
  foreignField: 'projectId'
});

projectSchema.methods.updateDuration = async function() {
  const entries = await mongoose.model('TimeEntry').find({ projectId: this._id });
  this.duration = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  await this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
