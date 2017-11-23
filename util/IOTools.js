const config = require('./config.json')

const path = require('path')
const fs = require('fs-extra')

module.exports = class IOTools {
  async getImage (filePath) {
    this.getFileSize(filePath).then(size => {
      if (size < 8000000) {
        fs.readFile(filePath).then((err, content) => {
          if (err) return Promise.reject(err)

          return Promise.resolve(content)
        })
      }
    })
  }

  async getImageFilenames (dirPath) {
    return fs.readdir(path.join('./images', dirPath))
  }

  async readFile (filePath) {
    return fs.readFile(filePath, 'utf-8')
  }

  async readRelativeFile (filePath) {
    return fs.readFile(path.join(__dirname, filePath), 'utf-8')
  }

  async readFileSync (filePath) {
    return fs.readFileSync(filePath, 'utf-8')
  }

  async getFileSize (filePath) {
    return fs.stat(filePath)
  }

  async fileExists (filePath) {
    return fs.exists(filePath)
  }

  async removeFile (filePath) {
    fs.exists(filePath).then(exists => {
      return fs.remove(filePath)
    })
  }
}
