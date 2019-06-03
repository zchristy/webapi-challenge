const express = require('express');

const actionsDb = require('../data/helpers/actionModel.js')

const router = express.Router();

router.use(express.json())

router.post('/', validateAction, (req, res) => {

  actionsDb.insert(req.action)
  .then(act => {
    res.status(201).json(act)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.get('/:id', validateId, (req, res) => {
  console.log(req.actionId)
  actionsDb.get(req.actionId)
  .then(act => {
    res.status(200).json(act)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.get('/', (req, res) => {

  actionsDb.get()
  .then(act => {
    res.status(200).json(act)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.delete('/:id', validateId,  (req, res) => {

  actionsDb.remove(req.actionId)
  .then(act => {
    res.status(200).json({success: "Action successfully deleted"})
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.put('/:id', validateId, validateAction, (req, res) => {
  actionsDb.update(req.actionId, req.action)
  .then(act => {
    res.status(201).json(act)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

//custom middleware

function validateId(req, res, next) {
  const { id } = req.params

  actionsDb.get(id)
  .then(act => {
    if(act) {
      req.actionId = act.id
      next()
    } else {
      res.status(400).json({ message: "invalid action id" })
    }
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request", message:`${err}`})
  })

};

function validateAction(req, res, next) {
  const { project_id, description, notes, completed } = req.body

  if(Object.keys(req.body).length) {
    if(project_id && description && notes) {
      req.action = {
        project_id: project_id,
        description: description,
        notes: notes,
        completed: completed
      }
      next()
    } else {
      res.status(400).json({ message: "missing required fields" })
    }
  } else {
    res.status(400).json({ message: "missing action data" })
  }

};


module.exports = router;
