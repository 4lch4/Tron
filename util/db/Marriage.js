const tools = new (require('../../util/Tools'))()
const mongoose = require('mongoose')
const baseUri = 'mongodb://localhost'

const userSchema = mongoose.Schema({
  _id: String,
  married: Boolean,
  divorced: Boolean,
  anniversary: String
})

class MarriageTool {
  constructor (proposee, proposer) {
    if (proposer !== undefined) {
      this.proposee = proposee
      this.proposer = proposer
    } else this.proposee = proposee
  }

  connect () {
    return mongoose.connect(`${baseUri}/${this.proposee}`)
  }

  retrieveMarriedList () {
    return new Promise((resolve, reject) => {
      const marriages = mongoose.model('Marriage', marriageSchema, 'marriages')
      marriages.find({ married: true }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })

      this.connect()
    })
  }

  exists () {
    return new Promise((resolve, reject) => {
      const marriage = mongoose.model('Marriage', marriageSchema, 'marriages')

      marriage.count({_id: this.proposer}, function (err, count) {
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

    const ProposeeDbModel = ProposeeDb.model('Marriage', marriageSchema, 'marriages')
    const ProposerDbModel = ProposerDb.model('Marriage', marriageSchema, 'marriages')

    return new Promise((resolve, reject) => {
      ProposerDbModel.create({
        _id: this.proposee,
        married: true,
        divorced: false,
        anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
      }).then(res => {
        ProposeeDbModel.create({
          _id: this.proposer,
          married: true,
          divorced: false,
          anniversary: tools.formatTime('MM/DD/YYYY @ HH:mm:ss')
        }).then(res => resolve()).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }
}

module.exports = MarriageTool
