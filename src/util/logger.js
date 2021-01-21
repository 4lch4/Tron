const { createLogger } = require('bunyan')

const logger = createLogger({
  name: 'Tron',
  streams: [
    { stream: process.stdout, level: 'info', name: 'Info' },
    { stream: process.stdout, level: 'debug', name: 'Debug' },
    { stream: process.stderr, level: 'error', name: 'Error' },
    { stream: process.stderr, level: 'fatal', name: 'Fatal' }
  ]
})

module.exports = { logger }
