const TimeEntry = require('../models/TimeEntry');
const Project = require('../models/Project');

// add
async function addTimeEntry(timeEntry) {
  const newTimeEntry = await TimeEntry.create(timeEntry);

  // await Project.findByIdAndUpdate(postId, {$push: {comments: newTimeEntry}});

  // await newTimeEntry.populate('author');

  return newTimeEntry;
}

// edit
async function editTimeEntry(projectId, userId, timeEntryId, project) {
  const newTimeEntry = await TimeEntry.findOneAndUpdate({_id: timeEntryId, userId, projectId}, project, {returnDocument: 'after'});

  return newTimeEntry;
}

// delete
async function deleteTimeEntry(projectId, userId, timeEntryId) {
  await TimeEntry.findOneAndDelete({_id: timeEntryId, userId, projectId});

  // await Project.findByIdAndUpdate(projectId, {$pull: {comments: timeEntryId}});
}

module.exports = {
  addTimeEntry,
  editTimeEntry,
  deleteTimeEntry,
}
