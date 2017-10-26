'use strict'

const download = require('image-downloader')
const config = require('./config.json')
const Tools = require('./Tools.js')
const tools = new Tools()
const fs = require('fs')

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

connection.connect()

class IOTools {
  constructor (options) {
    this.options = options || {}
  }

  executeSql (sql, callback) {
    connection.query(sql, (err, results, fields) => {
      if (err) throw err

      if (callback !== undefined) {
        callback(results, fields)
      }
    })
  }

  readFile (path, callback) {
    fs.readFile(path, 'utf-8', (filename, content) => {
      callback(content)
    })
  }

  downloadFiles (options, callback) {
    let processCount = 0
    let filenames = []

    options.forEach((option, key, array) => {
      if (!fs.existsSync(option.dest)) {
        download.image(option).then(({
          filename,
          image
        }) => {
          processCount++
          filenames.push(filename)

          if (processCount === array.length) {
            callback(filenames)
          }
        })
      } else {
        processCount++
        filenames.push(option.dest)

        if (processCount === array.length) {
          callback(filenames)
        }
      }
    })
  }

  processUrls (urls, callback) {
    let options = []

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i]
      let start = url.lastIndexOf('/') + 1
      let end = url.lastIndexOf('?')
      let filename = ''

      if (end === -1) {
        filename = url.substring(start)
      } else {
        filename = url.substring(start, end)
      }

      options.push({
        url: url,
        dest: '/var/tron/images/' + filename
      })
    }

    callback(options)
  }

  fileExists (filename) {
    return fs.existsSync(filename)
  }

  incrementCommandUse (commandName) {
    let queryString = "UPDATE COMMANDS SET `COMMAND_USE_COUNT` = `COMMAND_USE_COUNT` + 1 WHERE `COMMAND_NAME` = '" + commandName + "'"
    connection.query(queryString, (err, results, fields) => {
      if (err) throw err
    })
  }

  getAllCommandUsage (callback) {
    let queryString = 'SELECT * FROM COMMANDS ORDER BY COMMAND_USE_COUNT DESC;'

    connection.query(queryString, (err, results, fields) => {
      if (err) throw err

      callback(results)
    })
  }

  getCommandUsage (command, callback) {
    let queryString = "SELECT * FROM COMMANDS WHERE `COMMAND_NAME` = '" + command + "';"

    connection.query(queryString, (err, results, fields) => {
      if (err) throw err

      callback(results)
    })
  }

  getImage (path, onComplete) {
    if (!path.startsWith('/var/tron/')) {
      path = '/var/tron/images/' + path
    }

    if (this.getFileSize(path) < 8000000) {
      fs.readFile(path, (err, content) => {
        if (err) {
          throw err
        }

        onComplete(content)
      })
    }
  }

  getImages (dirnameIn, onComplete) {
    let dirname = '/var/tron/images/' + dirnameIn + '/'
    let images = []
    let filenames = []

    this.getImageFiles(dirname, (filename, content) => {
      images.push(content)
      filenames.push(filename)
    }, (err) => {
      console.log('An error has occured while getting images...')
      console.log(err)
    }, () => {
      onComplete(images, filenames)
    })
  }

  storeComic (comic, callback) {
    let date = tools.formatTimeString(comic.date)
    let filename = '/var/tron/feeds/' +
      comic.feedName + '/' +
      date + '.json'

    if (fs.existsSync(filename)) {
      callback(null, false)
    } else {
      fs.writeFile(filename, JSON.stringify(comic), (err) => {
        if (err) return err
        else {
          callback(null, true)
        }
      })
    }
  }

  getFileSize (filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
  }

  getImageFiles (dirname, onFileContent, onError, onComplete) {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        onError(err)
        return
      }

      for (let x = 0; x < filenames.length; x++) {
        let filename = dirname + filenames[x]
        if (this.getFileSize(filename) < 8000000) {
          onFileContent(filename, fs.readFileSync(filename))
        }
      }

      onComplete()
    })
  }

  removeFile (filename, callback) {
    if (fs.existsSync(filename)) {
      fs.unlink(filename, callback)
    }
  }

  saveFile (filename, content, callback) {
    fs.writeFile(filename, content, (err) => {
      if (err) return console.log(err)

      if (callback !== undefined) {
        callback()
      }
    })
  }
}

module.exports = IOTools
