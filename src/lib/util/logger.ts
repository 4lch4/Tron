import { createLogger } from 'bunyan'

export const logger = createLogger({
  name: 'Tron',
  streams: [
    { stream: process.stdout, level: 'debug', name: 'Debug' },
    { stream: process.stderr, level: 'error', name: 'Error' },
    { stream: process.stderr, level: 'fatal', name: 'Fatal' }
  ]
})
