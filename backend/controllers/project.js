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

  // await newProject.populate({
  //   path: 'comments',
  //   populate: 'author',
  // });

  return newProject;
}

// delete
function deleteProject(id) {
  return Project.deleteOne({_id: id});
}

// get list with search and pagination
// async function getProjects(search = '', limit = null, page = 1, userId) {
//   const [projects, count] = await Promise.all([
//     Project.find({name: {$regex: search, $options: 'i'}, userId: userId})
//       .skip(limit ? (page - 1) * limit : 0)
//       .limit(limit || null)
//       .sort({createdAt: -1})
//       .populate('timeEntries'),

//     Project.countDocuments({name: {$regex: search, $options: 'i'}, userId: userId})
//   ]);

//   return {
//     projects,
//     lastPage: limit ? Math.ceil(count / limit) : 1,
//   }
// }
async function getProjects(search = '', limit = null, page = 1, userId) {
  const query = {
    name: { $regex: search, $options: 'i' },
    userId: userId
  };

  // const projectsQuery = Project.find(query)
  //   .skip(limit ? (page - 1) * limit : 0)
  //   .limit(limit || null)
  //   .sort({ createdAt: -1 })
  //   .populate('timeEntries');

  const [projects, count] = await Promise.all([
    Project.find(query)
      .skip(limit ? (page - 1) * limit : 0)
      .limit(limit || null)
      .sort({ createdAt: -1 }),
      // .populate('timeEntries'),
    Project.countDocuments(query)
  ]);

  // const plainProjects = projects.map(p => p.toObject({ virtuals: true }));

  return {
    projects: projects,
    lastPage: limit ? Math.ceil(count / limit) : 1,
  };
}

// get post
function getProject(id, userId) {
  // return Project.findById(id).populate({
  //   path: 'comments',
  //   populate: 'author',
  // });

  return Project.findOne({
    _id: id,
    userId: userId,
  }).populate('timeEntries');
}

module.exports = {
  addProject,
  editProject,
  deleteProject,
  getProjects,
  getProject,
}
