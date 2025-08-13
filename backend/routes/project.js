const express = require('express')
const { addProject, getProjects, editProject, deleteProject, getProject } = require('../controllers/project');
const { addTimeEntry, editTimeEntry, deleteTimeEntry } = require('../controllers/timeEntry')
const authenticated = require('../middlewares/authenticated')
const hasRole = require('../middlewares/hasRole')
const mapProject = require('../helpers/mapProject')
const ROLES = require('../constants/roles');
const mapTimeEntry = require('../helpers/mapTimeEntry');
const mongoose = require('mongoose');

const router = express.Router({ mergeParams: true })

router.get('/', authenticated, async (req, res) => {
  const { projects, lastPage, totalCount } = await getProjects(
    req.query.search || '',
    req.query.limit || null,
    req.query.page || 1,
    req.query.sort || 'desc',
    req.user.id,
  )

  res.send({ data: { lastPage, projects: projects.map(mapProject), totalCount } })
})

router.get('/:id', authenticated, async (req, res) => {
  try {
    // Validate ID format first
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        data: null,
        error: 'Invalid project ID format',
        status: 404
      });
    }

    const project = await getProject(req.params.id, req.user.id);

    if (project) {
      res.send({ data: mapProject(project), error: null });
    } else {
      // res.send({ data: null, error: 'Failed to load project'})
      return res.status(404).json({data: null, error: 'Project not found', status: 404 });
    }
  } catch(error) {
    return res.status(500).json({data: null, error: 'Server error', status: 500 });
  }
})

router.post('/:id/time-entries', authenticated, async (req, res) => {
  const newTimeEntry = await addTimeEntry({
    projectId: req.params.id,
    userId: req.user.id,
    name: req.body.name,
    duration: req.body.duration,
  })

  // res.send({ data: mapTimeEntry(newTimeEntry) });
  res.send({ data: mapTimeEntry(newTimeEntry) });
})

router.patch('/:projectId/time-entries/:timeEntryId', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  const updatedTimeEntry = await editTimeEntry(
    req.params.projectId,
    req.user.id,
    req.params.timeEntryId,
    {
      name: req.body.name,
    }
  );

  res.send({ data: mapTimeEntry(updatedTimeEntry), error: null });
})

router.delete('/:projectId/time-entries/:timeEntryId', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  await deleteTimeEntry(
    req.params.projectId,
    req.user.id,
    req.params.timeEntryId,
  )

  res.send({ error: null })
})

router.post('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  try {
    const newProject = await addProject({
      userId: req.user.id,
      name: req.body.name,
    });

    res.send({ data: mapProject(newProject) });
  } catch(error) {
    let errorMessage = error.message || "Unknown error";

    if (error.code === 11000) {
      errorMessage = `Project "${req.body.name}" already exists`;
    }

    res.send({ data: null, error: errorMessage })
  }
})

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  try {
    const updatedProject = await editProject(
      req.params.id,
      {
        name: req.body.name,
      }
    );

    res.send({ data: mapProject(updatedProject) })
  } catch(error) {
    let errorMessage = error.message || "Unknown error";

    if (error.code === 11000) {
      errorMessage = `Project "${req.body.name}" already exists`;
    }

    res.send({ data: null, error: errorMessage })
  }
})

router.delete('/:id', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
  await deleteProject(req.params.id);

  res.send({ error: null })
})

module.exports = router
