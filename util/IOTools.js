"use strict"

const config = require('./config.json');
const fs = require('fs');

class IOTools {
    constructor(options) {
        this.options = options || {};
    }

    getImages(dirnameIn, onComplete) {
        let dirname = "./images/" + dirnameIn + "/";
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
}

module.exports = IOTools;