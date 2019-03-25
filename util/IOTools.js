const download = require('image-downloader')

const tools = new (require('./Tools'))()

const { join } = require('path')
const fs = require('fs-extra')

/** The path to the directory that contains all the images for Tron. */
const imageDirPath = join(__dirname, '..', 'images')

module.exports = class IOTools {
  getImagePath (filePath) {
    try {
      const finalPath = join('./images', filePath)
      if (this.getFileSize(finalPath) < 8000000) return finalPath
      else return 'Provided file is too large to send over Discord.'
    } catch (err) {
      return 'Invalid file path provided.'
    }
  }

  saveToFile (data, filename) {
    if (!data) return 'Data parameter doesn\'t contain any data.'

    const finalPath = join('data', 'filesSaved', filename)
    return fs.writeFile(finalPath, data)
      .then(res => { return finalPath })
      .catch(err => { throw err })
  }

  async downloadImage (options) {
    try {
      const { filename, image } = await download.image(options)

      return Promise.resolve({ filename, image })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getRandomImage (dirPath, args) {
    try {
      let filenames = await this.getImageFilenames(dirPath)
      if (args !== undefined && filenames[args[args.length - 1]] !== undefined) {
        return filenames[args.length - 1]
      } else return filenames[tools.getRandom(0, filenames.length)]
    } catch (err) { return err }
  }

  imageFolderExistsSync (name) {
    try {
      let exists = fs.existsSync(join(imageDirPath, name))
      return exists
    } catch (err) { console.error(err) }
  }

  imageFolderExists (name) {
    return new Promise((resolve, reject) => {
      try {
        fs.exists(join(imageDirPath, name), exists => { resolve(exists) })
      } catch (err) { reject(err) }
    })
  }

  async getImage (filename) {
    const finalPath = join(imageDirPath, filename)

    if (fs.existsSync(finalPath)) {
      if (this.getFileSize(finalPath) < 8000000) {
        return finalPath
      } else return new Error('The requested file is too large to display. (> 8mb)')
    } else return new Error('The requested file does not exist.')
  }

  getFileSize (filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
  }

  getImageFilenames (dirPath) {
    const finalDir = join('./images', dirPath)
    let filePaths = []

    return new Promise((resolve, reject) => {
      fs.readdir(finalDir).then(filenames => {
        for (let x = 0; x < filenames.length; x++) {
          let finalPath = join(finalDir, filenames[x])

          if (this.getFileSize(finalPath) < 8000000) filePaths.push(finalPath)
        }

        resolve(filePaths)
      }).catch(err => reject(err))
    })
  }

  async readDataFile (filename) {
    return fs.readFile(join(__dirname, '../data', filename), 'utf-8')
  }

  async readFile (filePath) {
    return fs.readFile(filePath, 'utf-8')
  }

  async readRelativeFile (filePath) {
    return fs.readFile(join(__dirname, filePath), 'utf-8')
  }

  readFileSync (filePath) {
    return fs.readFileSync(filePath)
  }

  async fileExists (filePath) {
    return fs.exists(filePath)
  }

  async removeFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.exists(filePath).then(exists => {
        if (exists) resolve(fs.remove(filePath))
        else resolve(fs.remove(filePath))
      }).catch(err => reject(err))
    })
  }
}
