
const tools = new (require('../../util/Tools'))()
const fs = require('fs-extra')
const PDF = require('pdfkit')

class AuditLogParser {
  /**
   * Default constructor for the LogParser class.
   *
   * @param {Map} logs AuditLogs you wish to parse
   */
  constructor (logs) {
    this.logs = logs
  }

  async getPDF (filename) {
    const doc = await this.getNewDoc(filename)
    const explanations = await this.getPlainExplanations()

    // explanations.forEach(val => doc.text(val))
    doc.list(explanations)

    doc.save().end()

    return Promise.resolve(doc)
  }

  /**
   * Creates a new PDF Document with the provided filename using the default
   * info and returns it via a promise.
   *
   * @param {string} filename
   * @returns {PDF} a new PDFKit.PDFDocument
   */
  async getNewDoc (filename) {
    const doc = new PDF()
    return new Promise((resolve, reject) => {
      doc.pipe(fs.createWriteStream(`./data/${filename}.pdf`))
      doc.font('./util/fonts/Roboto-Regular.ttf')

      doc.info.Author = 'Tron'
      doc.info.Creator = 'Alcha'
      doc.info.Title = 'Audit Logs For A Server'

      resolve(doc)
    })
  }

  async getPlainExplanations () {
    let explanations = []
    this.logs.forEach((val, key, map) => {
      const time = this.getTimeFromId(val.id)
      const action = ACTIONS[val.action]
      const executor = `${val.executor.username}#${val.executor.discriminator}`
      const target = TARGETS(val.targetType, val.target)
      explanations.push(`${time} - ${executor} ${action} ${target}`)
    })

    return Promise.resolve(explanations)
  }

  getTimeFromId (id) {
    return tools.customFormatUnixInput(tools.timestampFromSnowflake(id), 'HH:mm')
  }

  get levelOneValues () {
    this.logs.forEach((val, key, map) => {
      // console.log(val)
    })
  }
}

module.exports = AuditLogParser

const TARGETS = (targetType, target) => {
  switch (targetType) {
    case 'USER':
      return `${target.username}#${target.discriminator}`

    case 'INVITE':
      return ''

    case 'MESSAGE':
      return 'a message'

    case 'CHANNEL':
    case 'EMOJI':
    case 'ROLE':
    case 'GUILD':
    case 'WEBHOOK':
      return target.name

    default:
      return 'wut?'
  }
}

const ACTIONS = {
  'ALL': 'did a lot of shit',
  'GUILD_UPDATE': 'made changes to',
  'CHANNEL_CREATE': 'created the channel',
  'CHANNEL_UPDATE': 'updated the channel',
  'CHANNEL_DELETE': 'deleted the channel',
  'CHANNEL_OVERWRITE_CREATE': 'created channel overrides for',
  'CHANNEL_OVERWRITE_UPDATE': 'updated channel overrides for',
  'CHANNEL_OVERWRITE_DELETE': 'deleted channel overrides for',
  'MEMBER_KICK': 'kicked',
  'MEMBER_PRUNE': 'pruned',
  'MEMBER_BAN_ADD': 'banned',
  'MEMBER_BAN_REMOVE': 'removed the ban for',
  'MEMBER_UPDATE': 'updated',
  'MEMBER_ROLE_UPDATE': 'updated the roles for',
  'ROLE_CREATE': 'created the role',
  'ROLE_UPDATE': 'updated the role',
  'ROLE_DELETE': 'deleted the role',
  'INVITE_CREATE': 'created an invite',
  'INVITE_UPDATE': 'updated an invite',
  'INVITE_DELETE': 'deleted an invite',
  'WEBHOOK_CREATE': 'created the webhook',
  'WEBHOOK_UPDATE': 'updated the webhook',
  'WEBHOOK_DELETE': 'deleted the webhook',
  'EMOJI_CREATE': 'created the emoji',
  'EMOJI_UPDATE': 'updated the emoji',
  'EMOJI_DELETE': 'deleted the emoji',
  'MESSAGE_DELETE': 'deleted message'
}
