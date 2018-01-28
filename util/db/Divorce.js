const tools = new (require('../../util/Tools'))()
const mongoose = require('mongoose')
const baseUri = 'mongodb://localhost'

const userSchema = mongoose.Schema({
  _id: String,
  married: Boolean,
  divorced: Boolean,
  anniversary: String
})

class Divorce {
  constructor (proposee, proposer) {
    if (proposer !== undefined) {
      this.proposee = proposee
      this.proposer = proposer
    } else this.proposee = proposee
  }

  connect () {
    return mongoose.connect(`${baseUri}/${this.proposee}`)
  }

  retrieveDivorcedList () {
    return new Promise((resolve, reject) => {
      const divorces = mongoose.model('Divorce', userSchema, 'marriages')

      divorces.find({ divorced: true }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }

  exists () {
    return new Promise((resolve, reject) => {
      const divorce = mongoose.model('Divorce', userSchema, 'marriages')

      divorce.count({ _id: this.proposer }, function (err, count) {
        if (err) reject(err)
        else if (count > 0) resolve(true)
        else resolve(false)
      })

      this.connect()
    })
  }

  save () {
    const ProposeeDb = mongoose.createConnection(`${baseUri}/${this.proposee}`)
    const ProposerDb = mongoose.createConnection(`${baseUri}/${this.proposer}`)

    const ProposeeDbModel = ProposeeDb.model('Divorce', userSchema, 'marriages')
    const ProposerDbModel = ProposerDb.model('Divorce', userSchema, 'marriages')

    return new Promise((resolve, reject) => {
      ProposerDbModel.create({
        _id: this.proposee,
        married: false,
        divorced: true,
        anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
      }).then(res => {
        ProposeeDbModel.create({
          _id: this.proposer,
          married: false,
          divorced: true,
          anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
        }).then(res => resolve()).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }
}

module.exports = Divorce
