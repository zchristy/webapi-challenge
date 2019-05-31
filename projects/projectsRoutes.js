const express = require('express');

const projectsDb = require('../data/helpers/projectModel.js')

const router = express.Router();

router.use(express.json())

router.post('/', validateProject, (req, res) => {

  projectsDb.insert(req.project)
  .then(proj => {
    res.status(201).json(proj)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.get('/', (req, res) => {
  projectsDb.get()
  .then(proj => {
    res.status(200).json(proj)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.get('/:id', validateId, (req, res) => {
  projectsDb.get(req.projectId)
  .then(proj => {
    res.status(200).json(proj)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.get('/:id/actions', validateId, (req, res) => {

  projectsDb.getProjectActions(req.projectId)
  .then(act => {
    if(act.length > 0) {
      res.status(200).json(act)
    } else {
      res.status(400).json({message: "There are no actions for this project"})
    }
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.delete('/:id', validateId,  (req, res) => {

  projectsDb.remove(req.projectId)
  .then(proj => {
    res.status(200).json({success: "Project successfully deleted"})
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.put('/:id', validateId, validateProject, (req, res) => {
  projectsDb.update(req.projectId, req.project)
  .then(proj => {
    res.status(201).json(proj)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

//custom middleware

function validateId(req, res, next) {
  const { id } = req.params

    projectsDb.get(id)
    .then(proj => {
      if(proj) {
        req.projectId = proj.id
        next()
      } else {
        res.status(400).json({ message: "invalid project id" })
      }
    })
    .catch(err => {
      res.status(500).json({error: "Bad Request"})
    })

};

function validateProject(req, res, next) {
  const { name, description, completed } = req.body

  if(Object.keys(req.body).length) {
    if(name && description) {
      req.project = {
        name: name,
        description: description,
        completed: completed
      }
      next()
    } else {
      res.status(400).json({ message: "missing required fields" })
    }
  } else {
    res.status(400).json({ message: "missing project data" })
  }

};


module.exports = router;
