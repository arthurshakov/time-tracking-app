const Project = require('../models/Project');

// add
async function addProject(project) {
  const newProject = await Project.create(project);

  // await newProject.populate({
  //   path: 'comments',
  //   populate: 'author',
  // });

  return newProject;
}

// edit
async function editProject(id, project) {
  const newProject = await Project.findByIdAndUpdate(id, project, {returnDocument: 'after'})

  return newProject;
}

// delete
function deleteProject(id) {
  // await mongoose.model('TimeEntry').deleteMany({ projectId: id });
  return Project.deleteOne({_id: id});
}

// get list with search and pagination
async function getProjects(search = '', limit = null, page = 1, createdAt = 'desc', userId) {
  const query = {
    name: { $regex: search, $options: 'i' },
    userId,
  };

  const [projects, count] = await Promise.all([
    Project.find(query)
      .sort({ createdAt })
      .skip(limit ? (page - 1) * limit : 0)
      .limit(limit || 0),

    Project.countDocuments(query)
  ]);

  return {
    projects: projects,
    lastPage: limit ? Math.ceil(count / limit) : 1,
    totalCount: count,
  };
}

// get post
async function getProject(id, userId) {
  try {
    const project = await Project.findOne({
      _id: id,
      userId: userId,
    }).populate('timeEntries');

    return project || null; // Explicitly return null for missing projects
  } catch (error) {
    console.error('Database error:', error);
    throw error; // Only throw for genuine database errors
  }
}

module.exports = {
  addProject,
  editProject,
  deleteProject,
  getProjects,
  getProject,
}
