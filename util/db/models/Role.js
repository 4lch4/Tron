const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
  _id: Number,
  name: String
})

/**
 * Creates a new model using the Mongoose library. Both parameters are optional and
 * can be used to specify different Role models.
 *
 * @param {string} roleName
 * @param {string} collection
 * @returns {mongoose.Model}
 */
module.exports = (roleName, collection) => {
  return mongoose.model(roleName, roleSchema, collection)
}
