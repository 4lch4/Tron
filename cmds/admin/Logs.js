const BaseCmd = require('../BaseCmd')
// const actions = require('../../data/audit_log/AuditLogActions')
// const converter = require('json2csv')
// const io = new (require('../../util/IOTools'))()
// const _ = require('lodash')
const Parser = require('../util/AuditLogParser')
// const pdf = require('')

class Logs extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'logs',
      memberName: 'logs',
      group: 'admin',
      description: 'Displays the audit log export functions.',
      aliases: ['csv', 'auditlog', 'getlogs'],
      examples: ['+logs pdf', '+getlogs csv']
    })
  }

  async run (msg, args) {
    const logs = await msg.guild.fetchAuditLogs()
    console.log(logs.entries)
    const parser = new Parser(logs.entries)
    console.log(parser.plainExplanations)
    parser.getPDF('Audit_Log_Test').then(res => {
      console.log(`PDF Retrieved...`)
    }).catch(err => console.error(err))
    /* console.log(toArray(logs.entries))
    let entries = _.toArray(logs.entries)
    let fields = logs.entries.keyArray()
    console.log(`fields...`)
    console.log(fields) */
  }
}

function toArray (obj) {
  const result = []
  for (let x = 0; x < obj.length; x++) {
    console.log(``)
  }
  for (const prop in obj) {
    const value = obj[prop]
    if (typeof value === 'object') {
      result.push(toArray(value)) // <- recursive call
    } else {
      result.push(prop)
    }
  }
  return result
}

module.exports = Logs
