const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  adopter: String,
  adoptee: String,
  adoptionDate: String
}, { collection: 'adoptions' })

module.exports.Model = connection => {
  return connection.model('Adoption', Schema, 'adoptions')
}

module.exports.Schema = Schema
