const mongoose = require("mongoose");
const mapTimeEntry = require("./mapTimeEntry");

module.exports = function (project) {
  return {
    id: project.id,
    userId: project.userId,
    name: project.name,
    duration: project.duration,
    createdAt: project.createdAt,
    timeEntries: project.timeEntries?.map(mapTimeEntry),
  };
};
