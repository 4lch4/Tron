const config = require('./config.json')

const download = require('image-downloader')

const tools = new (require('./Tools'))()

const path = require('path')
const fs = require('fs-extra')

module.exports = class IOTools {
  getImagePath (filePath) {
    const finalPath = path.join('./images', filePath)

    return new Promise((resolve, reject) => {
      this.getFileSize(finalPath).then(size => {
        if (size < 8000000) {
          resolve(finalPath)
        }
      })
    })
  }

  async downloadImage (options) {
    try {
      const { filename, image } = await download.image(options)

      return Promise.resolve({ filename, image })
    } catch (err) {
      return Promise.reject(err)
    }
  }
  getRandomImage (dirPath) {
    return new Promise((resolve, reject) => {
      this.getImageFilenames(dirPath).then(filenames => {
        const random = tools.getRandom(0, filenames.length)
        resolve(filenames[random])
      })
    })
  }

  async getImageFilenames (dirPath) {
    const finalPath = path.join('./images', dirPath)
    let filePaths = []

    return new Promise((resolve, reject) => {
      fs.readdir(finalPath).then(filenames => {
        for (let x = 0; x < filenames.length; x++) {
          filePaths.push(path.join(finalPath, filenames[x]))
        }

        resolve(filePaths)
      })
    })
  }

  async readDataFile (filename) {
    return fs.readFile(path.join(__dirname, '../data', filename), 'utf-8')
  }

  async readFile (filePath) {
    return fs.readFile(filePath, 'utf-8')
  }

  async readRelativeFile (filePath) {
    return fs.readFile(path.join(__dirname, filePath), 'utf-8')
  }

  readFileSync (filePath) {
    return fs.readFileSync(filePath)
  }

  async getFileSize (filePath) {
    return Promise.resolve(fs.stat(filePath).then(stats => { return stats.size }))
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
