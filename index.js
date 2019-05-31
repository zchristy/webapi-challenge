const express = require('express');

const server = require('./server.js');
const projectsRoutes = require('./projects/projectsRoutes.js')
const actionsRoutes = require('./actions/actionsRoutes.js')

const app = express();

app.use('/', server)
app.use('/api/projects', projectsRoutes)
app.use('/api/actions', actionsRoutes)

app.listen(5000, () => {
  console.log('App is running on port 5000')
})
