"use strict"

const config = require('./config.json');
const Tools = require('./Tools.js');
const tools = new Tools();
const fs = require('fs');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

connection.connect();

class IOTools {
    constructor(options) {
        this.options = options || {};
    }

    readFile(path, callback) {
        fs.readFile(path, "utf-8", (filename, content) => {
            callback(content);
        });
    }

    fileExists(filename) {
        return fs.existsSync(filename);
    }

    incrementCommandUse(commandName) {
        let queryString = "UPDATE COMMANDS SET `COMMAND_USE_COUNT` = `COMMAND_USE_COUNT` + 1 WHERE `COMMAND_NAME` = '" + commandName + "'";
        connection.query(queryString, (err, res, fields) => {
            if (err) throw err;
        });
    }

    getAllCommandUsage(callback) {
        let queryString = "SELECT * FROM COMMANDS ORDER BY COMMAND_USE_COUNT DESC;";

        connection.query(queryString, (err, res, fields) => {
            if (err) throw err;

            callback(res);
        });
    };

    getCommandUsage(command, callback) {
        let queryString = "SELECT * FROM COMMANDS WHERE `COMMAND_NAME` = '" + command + "';";

        connection.query(queryString, (err, res, fields) => {
            if (err) throw err;

            callback(res);
        });
    }

    getImage(path, onComplete) {
        path = "/root/tron/images/" + path;

        fs.readFile(path, (filename, content) => {
            onComplete(content);
        });
    }

    getImages(dirnameIn, onComplete) {
        let dirname = "/root/tron/images/" + dirnameIn + "/";
        let images = [];

        this.readFiles(dirname, (filename, content) => {
            images.push(content);
        }, (err) => {
            console.log("Error occured.");
            console.log(err);
        }, () => {
            onComplete(images);
        })
    }

    storeComic(comic, callback) {
        let date = tools.formatTimeString(comic.date);
        let filename = "/root/tron/feeds/" +
            comic.feedName + "/" +
            date + ".json";

        if (fs.existsSync(filename)) {
            callback(false);
        } else {
            fs.writeFile(filename, JSON.stringify(comic), (err) => {
                if (err) return err;
                else {
                    callback(true);
                }
            });
        }
    }

    readFiles(dirname, onFileContent, onError, onComplete) {
        let processNum = 0;

        fs.readdir(dirname, (err, filenames) => {
            if (err) {
                onError(err);
                return;
            }

            filenames.forEach((filename, index, array) => {
                fs.readFile(dirname + filename, (err, content) => {
                    if (err) {
                        onError(err);
                        return;
                    }

                    onFileContent(filename, content);

                    processNum++;
                    if (processNum == array.length) {
                        onComplete();
                    }
                })
            });
        });
    }

    removeFile(filename, callback) {
        if (fs.existsSync(filename)) {
            fs.unlink(filename, callback);
        }
    }

    saveFile(filename, content, callback) {
        fs.writeFile(filename, content, (err) => {
            if (err) return console.log(err);

            console.log('File saved!');

            if (callback != undefined) {
                callback();
            }
        });
    }
}

module.exports = IOTools;