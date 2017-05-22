"use strict"

const config = require('../util/config.json');
const IOTools = require('../util/IOTools.js');
const Tools = require('../util/Tools.js');

const tools = new Tools();
const ioTools = new IOTools();

/** Stores images for the Confused command */
let confusedImages = []

/** Stores images for the Pout command */
let poutImages = []

/** Stores images for the Vape Nation command */
let vnImages = [];

/** Stores images for the Wave command */
let waveImages = [];

/** Stores images for the KillMe command */
let killMeImages = [];

/** Stores images for the Spank command */
let spankImages = [];

/** Stores images for the Blush command */
let blushImages = [];

/** Stores images for the Bite command */
let biteImages = [];

/** Stores images for the Fake command */
let fakeImages = [];

/** Stores images for the Kill command */
let killImages = [];

/** Stores images for the Kiss command */
let kissImages = [];

/** Stores images for the Poke command */
let pokeImages = [];

/** Stores images for the Kick command */
let kickImages = [];

/** Stores images for the Love command */
let loveImages = [];

/** Stores images for the Rekt command */
let rektImages = [];

/** Stores images for the Hug command */
let hugImages = [];

/** Stores images for the Cry command */
let cryImages = [];

/** Stores images for the Pat command */
let patImages = [];

class Reactions {
    constructor(options) {
        this.options = options || {};
    }

    pickKissImage(callback, imgIndex) {
        console.log('imgIndex =');
        console.log(imgIndex);
        // If images aren't already stored, pull them from storage
        if (kissImages.length == 0) {
            ioTools.getImages('kiss', (images) => {
                // Add the images retrieved from storage to the kissImages array
                kissImages = kissImages.concat(images);

                // If the imgIndex is smaller than the array length, return that specific image
                if (imgIndex < kissImages.length) {
                    callback(kissImages[imgIndex]);
                } else {
                    // If imgIndex is too large or undefined, return a random image
                    let random = tools.getRandom(0, kissImages.length);

                    callback(kissImages[random]);
                }
            });
        } else if (imgIndex < kissImages.length) {
            // If the imgIndex is smaller than the array length, return that specific image
            callback(kissImages[imgIndex]);
        } else {
            // If imgIndex is too large or undefined, return a random image
            let random = tools.getRandom(0, kissImages.length);

            callback(kissImages[random]);
        }
    }

    pickConfusedImage(callback) {
        if (poutImages.length == 0) {
            ioTools.getImages('confused', (images) => {
                let random = tools.getRandom(0, images.length);

                confusedImages = confusedImages.concat(images);

                callback(confusedImages[random]);
            });
        } else {
            let random = tools.getRandom(0, confusedImages.length);

            callback(confusedImages[random]);
        }
    }

    pickPoutImage(callback) {
        if (poutImages.length == 0) {
            ioTools.getImages('pout', (images) => {
                let random = tools.getRandom(0, images.length);

                poutImages = poutImages.concat(images);

                callback(poutImages[random]);
            });
        } else {
            let random = tools.getRandom(0, poutImages.length);

            callback(poutImages[random]);
        }
    }

    pickWaveImage(callback) {
        if (waveImages.length == 0) {
            ioTools.getImages('wave', (images) => {
                let random = tools.getRandom(0, images.length);

                waveImages = waveImages.concat(images);

                callback(waveImages[random]);
            });
        } else {
            let random = tools.getRandom(0, waveImages.length);

            callback(waveImages[random]);
        }
    }

    pickVNImage(callback) {
        if (vnImages.length == 0) {
            ioTools.getImages('vapenation', (images) => {
                let random = tools.getRandom(0, images.length);

                vnImages = vnImages.concat(images);

                callback(vnImages[random]);
            });
        } else {

            let random = tools.getRandom(0, vnImages.length);

            callback(vnImages[random]);
        }
    }

    pickKillImage(callback) {
        if (killImages.length == 0) {
            ioTools.getImages('kill', (images) => {
                let random = tools.getRandom(0, images.length);

                killImages = killImages.concat(images);

                callback(killImages[random]);
            })
        } else {
            let random = tools.getRandom(0, killImages.length);

            callback(killImages[random]);
        }
    }

    pickPatImage(callback, imgIndex) {
        console.log('imgIndex =');
        console.log(imgIndex);
        if (patImages.length == 0) {
            ioTools.getImages('pat', (images) => {

                patImages = patImages.concat(images);

                if (imgIndex < patImages.length) {
                    callback(patImages[imgIndex]);
                } else {
                    let random = tools.getRandom(0, patImages.length);

                    callback(patImages[random]);
                }
            });
        } else if (imgIndex < patImages.length) {
            callback(patImages[imgIndex]);
        } else {
            let random = tools.getRandom(0, patImages.length);

            callback(patImages[random]);
        }
    }

    pickSpankImage(callback) {
        if (spankImages.length == 0) {
            ioTools.getImages('spank', (images) => {
                let random = tools.getRandom(0, images.length);
                spankImages = spankImages.concat(images);

                callback(spankImages[random]);
            })
        } else {
            let random = tools.getRandom(0, spankImages.length);

            callback(spankImages[random]);
        }
    }

    pickKickImage(callback) {
        if (kickImages.length == 0) {
            ioTools.getImages('kick', (images) => {
                let random = tools.getRandom(0, images.length);
                kickImages = kickImages.concat(images);

                callback(kickImages[random]);
            })
        } else {
            let random = tools.getRandom(0, kickImages.length);

            callback(kickImages[random]);
        }
    }

    pickKillMeImage(callback) {
        if (killMeImages.length == 0) {
            ioTools.getImages('killme', (images) => {
                let random = tools.getRandom(0, images.length);
                killMeImages = killMeImages.concat(images);

                callback(killMeImages[random]);
            });
        } else {
            let random = tools.getRandom(0, killMeImages.length);

            callback(killMeImages[random]);
        }
    }

    pickPokeImage(callback) {
        if (pokeImages.length == 0) {
            ioTools.getImages('poke', (images) => {
                let random = tools.getRandom(0, images.length);
                pokeImages = pokeImages.concat(images);

                callback(pokeImages[random]);
            });
        } else {
            let random = tools.getRandom(0, pokeImages.length);

            callback(pokeImages[random]);
        }
    }

    pickBiteImage(callback) {
        if (biteImages.length == 0) {
            ioTools.getImages('bite', (images) => {
                let random = tools.getRandom(0, images.length);
                biteImages = biteImages.concat(images);

                callback(biteImages[random]);
            });
        } else {
            let random = tools.getRandom(0, biteImages.length);

            callback(biteImages[random]);
        }
    }

    pickFakeImage(callback) {
        if (fakeImages.length == 0) {
            ioTools.getImages('fake', (images) => {
                fakeImages = fakeImages.concat(images);

                callback(fakeImages[0]);
            });
        } else {
            callback(fakeImages[0]);
        }
    }

    pickCryImage(callback) {
        if (cryImages.length == 0) {
            ioTools.getImages('cry', (images) => {
                let random = tools.getRandom(0, images.length);
                cryImages = cryImages.concat(images);

                callback(cryImages[random]);
            });
        } else {
            let random = tools.getRandom(0, cryImages.length);

            callback(cryImages[random]);
        }
    }

    pickRektImage(callback) {
        if (rektImages.length == 0) {
            ioTools.getImages('rekt', (images) => {
                let random = tools.getRandom(0, images.length);
                rektImages = rektImages.concat(images);

                callback(rektImages[random]);
            });
        } else {
            let random = tools.getRandom(0, rektImages.length);

            callback(rektImages[random]);
        }
    }

    pickHugImage(callback) {
        if (hugImages.length == 0) {
            ioTools.getImages('hug', (images) => {
                let random = tools.getRandom(0, images.length);
                hugImages = hugImages.concat(images);

                callback(hugImages[random]);
            });
        } else {
            let random = tools.getRandom(0, hugImages.length);

            callback(hugImages[random]);
        }
    }

    pickBlushImage(callback) {
        if (blushImages.length == 0) {
            ioTools.getImages('blush', (images) => {
                let random = tools.getRandom(0, images.length);
                blushImages = blushImages.concat(images);

                callback(blushImages[random]);
            });
        } else {
            let random = tools.getRandom(0, blushImages.length);

            callback(blushImages[random]);
        }
    }

    pickLoveImage(callback) {
        if (loveImages.length == 0) {
            ioTools.getImages('love', (images) => {
                let random = tools.getRandom(0, images.length);
                loveImages = loveImages.concat(images);

                callback(loveImages[random]);
            });
        } else {
            let random = tools.getRandom(0, loveImages.length);

            callback(loveImages[random]);
        }
    }
}

module.exports = Reactions;