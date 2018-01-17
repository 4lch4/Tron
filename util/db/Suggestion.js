const mongoose = require('mongoose')
const baseUri = 'mongodb://localhost'

const suggestionSchema = mongoose.Schema({
  _id: String,
  author: String,
  content: String
})

class Suggestion {
  constructor (timeSubmitted, authorId, contentIn) {
    this._id = timeSubmitted
    this._author = authorId
    this._content = contentIn
    this._connection = mongoose.createConnection(`${baseUri}/data`)
  }

  set author (input) {
    this._author = input
  }

  set content (input) {
    this._content = input
  }

  save () {
    return new Promise((resolve, reject) => {
      if (this._content.length === 0) reject(new Error('No content provided for the new suggestion.'))
      if (this._author.length === 0) reject(new Error('No author was provided for the new suggestion.'))

      let newSuggestion = this._connection.model('Suggestion', suggestionSchema)

      newSuggestion.create({
        _id: this._id,
        author: this._author,
        content: this._content
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }
}

module.exports = Suggestion
