const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const express = require('express')
const morgan = require('morgan')
const app = express()

module.exports = client => {
  app.use(bodyParser.json())
  app.use(morgan('tiny'))

  app.get('/api/v1/count', (req, res) => require('./routes/count')(req, res, client))
  app.post('/api/v1/count', (req, res) => require('./routes/count')(req, res, client))

  app.get('/api/v1/health', (req, res) => require('./routes/health')(req, res, client))
  app.post('/api/v1/health', (req, res) => require('./routes/health')(req, res, client))

  app.get('/api/v1/client', (req, res) => require('./routes/client')(req, res, client))
  app.post('/api/v1/client', (req, res) => require('./routes/client')(req, res, client))

  app.listen(port)
  console.log(`Express listening on port ${port}...`)
}
