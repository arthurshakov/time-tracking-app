module.exports = function (timeEntry) {
  return {
    id: timeEntry._id,
    userId: timeEntry.userId,
    projectId: timeEntry.projectId,
    duration: timeEntry.duration,
    name: timeEntry.name,
    createdAt: timeEntry.createdAt,
  };
};
