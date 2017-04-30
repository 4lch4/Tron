"use strict"

const config = require('./config.json');
const Tools = require('./Tools.js');
const tools = new Tools();
const fs = require('fs');

class IOTools {
    constructor(options) {
        this.options = options || {};
    }

    fileExists(filename) {
        return fs.existsSync(filename);
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