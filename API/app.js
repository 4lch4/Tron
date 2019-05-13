const { noFields } = require('./routes/shared')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3042

const endpoints = {
  count: 'Various counts of data from Tron, such as command counts, the amount of users, etc.',
  health: 'Various points of data about the current status/health of Tron.',
  client: 'Various points of data about the Tron client.'
}

module.exports = client => {
  // #region Middleware Initiators
  app.use(bodyParser.json())
  app.use(morgan('tiny'))
  // #endregion Middleware Initiators

  // #region Handles empty GET request
  app.get('/api/v1', (req, res) => noFields(res, endpoints))
  // #endregion Handles empty GET request

  // #region Count Endpoint
  app.get('/api/v1/count', (req, res) => require('./routes/count')(req, res, client))
  app.post('/api/v1/count', (req, res) => require('./routes/count')(req, res, client))
  // #endregion Count Endpoint

  // #region Health Endpoint
  app.get('/api/v1/health', (req, res) => require('./routes/health')(req, res, client))
  app.post('/api/v1/health', (req, res) => require('./routes/health')(req, res, client))
  // #endregion Health Endpoint

  // #region Client Endpoint
  app.get('/api/v1/client', (req, res) => require('./routes/client')(req, res, client))
  app.post('/api/v1/client', (req, res) => require('./routes/client')(req, res, client))
  // #endregion Client Endpoint

  app.listen(port)
  console.log(`Express listening on port ${port}...`)
}
