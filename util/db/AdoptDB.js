const tools = new (require('../../util/Tools.js'))()
const mongoose = require('mongoose')

/** The base URI for connecting to the remote MongoDB instance */
const mongoUri = require('../../util/config.json').mongoUrl

/** Our collection of colors used to style the embed */
const colors = require('../../util/colors').Decimal

module.exports = class AdoptDB {
  constructor (adopterIn, adopteeIn) {
    this.connection = mongoose.createConnection(mongoUri)
    this.AdoptionModel = require('./models/Adoption').Model(this.connection)

    if (adopterIn !== undefined && adopteeIn !== undefined) {
      this.adopter = adopterIn
      this.adoptee = adopteeIn
      this.model = new this.AdoptionModel({ adopter: adopterIn, adoptee: adopteeIn, adoptionDate: tools.formatTime('MM/DD/YYYY') })
    }
  }

  /**
   * Inserts the currently stored adopter and adoptee id as a new adoption in
   * the Mongo DB. Uses the Insert function so make sure to call this first and
   * then you can use the delete function if need be.
   */
  save () {
    return new Promise((resolve, reject) => {
      if (this.model === undefined) {
        reject(new Error('The model has not been initiated, please provide an adopter and adoptee before calling this.'))
      } else {
        this.model.save((err, res) => {
          if (err) reject(err)
          else {
            console.log(`res...`)
            console.log(res)
            resolve(res)
          }
        })
      }
    })
  }

  /**
   * Gets a list of adoptions from the database for the given user and formats
   * the results into a nice Embed object for displaying in a channel.
   *
   * @param {User} adopter The user whos list of adoptions you wish to retrieve.
   * @param {Client} client The bot client, used for retrieving usernames from the user id.
   */
  async getAdoptionsList (adopter, client) {
    try {
      let adopterAdoptions = await this.AdoptionModel.find({ adopter: adopter.id })
      let adopteeAdoptions = await this.AdoptionModel.find({ adoptee: adopter.id })
      let adopterFields = await getAdopterFields(adopterAdoptions, client)
      let adopteeFields = await getAdopteeFields(adopteeAdoptions, client)

      let fieldsOut = adopterFields.concat(adopteeFields)

      if (fieldsOut.length > 0) {
        return Promise.resolve({
          embed: {
            color: colors.green.P500,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL()
            },
            description: `A list of adoptions and their anniversary for ${adopter.username}.`,
            fields: fieldsOut
          }
        })
      } else return Promise.resolve({ content: `${adopter.username} currently has no adoptions. :cry:` })
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  /**
   * Deletes the adoption from the database if it exists.
   */
  delete () {
    return new Promise((resolve, reject) => {
      this.exists().then(exists => {
        if (exists) {
          this.AdoptionModel.deleteOne({
            adopter: this.adopter,
            adoptee: this.adoptee
          }, err => {
            if (err) reject(err)
            else resolve()
          })
        } else resolve()
      })
    })
  }

  /**
   * Determines if the adoption already exists in the database and returns true
   * or false via a Promise.
   */
  exists (adopterId = this.adopter, adopteeId = this.adoptee) {
    return new Promise((resolve, reject) => {
      if (adopterId === undefined || adopteeId === undefined) {
        reject(new Error('An adopter and adoptee id must be provided for this function to work.'))
      } else {
        this.AdoptionModel.countDocuments({
          adopter: adopterId,
          adoptee: adopteeId
        }, (err, count) => {
          if (err) reject(err)
          else if (count > 0) {
            console.log(`count = ${count}`)
            resolve(true)
          } else resolve(false)
        })
      }
    })
  }

  /** Closes the current Mongo connection and resets the stored values. */
  finish () {
    this.connection.close()
    this.adoptee = undefined
    this.adopter = undefined
  }
}

/**
 * Using the provided raw list of adoptions, fields that are to be added to an
 * Embed object are generated. The fields themselves aren't very useful unless
 * added to an Embed, which will then display the list in an appealing format.
 *
 * @param {Object} adoptions The raw list of adoptions for a given user from the database.
 * @param {Client} client The bot client, used for obtaining usernames from a user id.
 * @return {Object[]}
 */
const getAdopterFields = (adoptions, client) => {
  let fieldsOut = []

  return new Promise((resolve, reject) => {
    for (let x = 0; x < 9; x++) {
      if (adoptions[x] !== undefined) {
        let user = client.users.get(adoptions[x].adoptee)

        if (user !== undefined) {
          fieldsOut.push({
            'name': `👶 ${user.username}`,
            'value': `*- ${adoptions[x].adoptionDate}*`,
            'inline': true
          })
        }
      }
    }

    resolve(fieldsOut)
  })
}

/**
 * Using the provided raw list of adoptions, fields that are to be added to an
 * Embed object are generated. The fields themselves aren't very useful unless
 * added to an Embed, which will then display the list in an appealing format.
 *
 * @param {Object} adoptions The raw list of adoptions for a given user from the database.
 * @param {Client} client The bot client, used for obtaining usernames from a user id.
 * @return {Object[]}
 */
const getAdopteeFields = async (adoptions, client) => {
  let fieldsOut = []

  for (let x = 0; x < 9; x++) {
    if (adoptions[x] !== undefined) {
      fieldsOut.push({
        'name': `👴 ${client.users.get(adoptions[x].adopter).username}`,
        'value': `*- ${adoptions[x].adoptionDate}*`,
        'inline': true
      })
    }
  }

  return Promise.resolve(fieldsOut)
}
