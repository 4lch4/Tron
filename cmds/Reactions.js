"use strict"

const config = require('../util/config.json');
const IOTools = require('../util/IOTools.js');
const Tools = require('../util/Tools.js');

const tools = new Tools();
const ioTools = new IOTools();

/** Stores images for the Snow command */
let kaylaImages = [];

/** Stores images for the Alcha command */
let jerryImages = [];
let jerryFilenames = [];

/** Stores images for the Lewd command */
let lewdImages = [];
let lewdFilenames = [];

/** Stores images for the Cat command */
let catImages = [];
let catFilenames = [];

/** Stores images for the Rose command */
let roseImages = [];
let roseFilenames = [];

/** Stores images for the Squirtle command */
let squirtleImages = [];
let squirtleFilenames = [];

/** Stores images for the Nobulli command */
let noBulliImages = [];

/** Stores images for the Dreamy command */
let dreamyImages = [];

/** Stores images for the Slap command */
let slapImages = [];

/** Stores images for the Dance command */
let danceImages = [];

/** Stores images for the Punch command */
let punchImages = [];

/** Stores images for the Confused command */
let confusedImages = [];

/** Stores images for the Pout command */
let poutImages = [];

/** Stores images for the Vape Nation command */
let vnImages = [];

/** Stores images for the Dodge command */
let dodgeImages = [];

/** Stores images for the Lick command */
let lickImages = [];

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

    pickCatImage(callback, imgIndex) {
        if (catImages.length == 0) {
            ioTools.getImages('cats', (images, filenames) => {
                catImages = catImages.concat(images);
                catFilenames = filenames;

                if (imgIndex < catImages.length) {
                    callback(catImages[imgIndex], catFilenames[imgIndex]);
                } else {
                    let random = tools.getRandom(0, catImages.length);

                    callback(catImages[random], catFilenames[random]);
                }
            });
        } else {
            if (imgIndex < catImages.length) {
                callback(catImages[imgIndex], catFilenames[imgIndex]);
            } else {
                let random = tools.getRandom(0, catImages.length);

                callback(catImages[random], catFilenames[random]);
            }
        }
    }

    pickLewdImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (lewdImages.length == 0) {
                ioTools.getImages('lewd', (images, filenames) => {
                    lewdImages = lewdImages.concat(images);
                    lewdFilenames = filenames;

                    if (imgIndex < lewdImages.length) {
                        resolve({
                            image: lewdImages[imgIndex],
                            filename: lewdFilenames[imgIndex]
                        });
                    } else {
                        let random = tools.getRandom(0, images.length);

                        resolve({
                            image: lewdImages[random],
                            filename: lewdFilenames[random]
                        });
                    }
                })
            } else {
                if (imgIndex < lewdImages.length) {
                    resolve({
                        image: lewdImages[imgIndex],
                        filename: lewdFilenames[imgIndex]
                    });
                } else {
                    let random = tools.getRandom(0, lewdImages.length);

                    resolve({
                        image: lewdImages[random],
                        filename: lewdFilenames[random]
                    });
                }
            }
        });
    }

    pickSquirtleImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (squirtleImages.length == 0) {
                ioTools.getImages('squirtle', (images, filenames) => {
                    squirtleImages = squirtleImages.concat(images);
                    squirtleFilenames = filenames;

                    if (imgIndex < squirtleImages.length) {
                        resolve({
                            image: squirtleImages[imgIndex],
                            filename: squirtleFilenames[imgIndex]
                        });
                    } else {
                        let random = tools.getRandom(0, images.length);

                        resolve({
                            image: squirtleImages[random],
                            filename: squirtleFilenames[random]
                        });
                    }
                })
            } else {
                if (imgIndex < squirtleImages.length) {
                    resolve({
                        image: squirtleImages[imgIndex],
                        filename: squirtleFilenames[imgIndex]
                    });
                } else {
                    let random = tools.getRandom(0, squirtleImages.length);

                    resolve({
                        image: squirtleImages[random],
                        filename: squirtleFilenames[random]
                    });
                }
            }
        });
    }

    pickRoseImage(callback, imgIndex) {
        if (roseImages.length == 0) {
            ioTools.getImages('rose', (images, filenames) => {
                roseImages = roseImages.concat(images);
                roseFilenames = filenames;

                if (imgIndex < roseImages.length) {
                    callback(roseImages[imgIndex], roseFilenames[imgIndex]);
                } else {
                    let random = tools.getRandom(0, roseImages.length);

                    callback(roseImages[random], roseFilenames[random]);
                }
            });
        } else {
            if (imgIndex < roseImages.length) {
                callback(roseImages[imgIndex], roseFilenames[imgIndex]);
            } else {
                let random = tools.getRandom(0, roseImages.length);

                callback(roseImages[random], roseFilenames[random]);
            }
        }
    }

    pickNobulliImage(callback, imgIndex) {
        if (noBulliImages.length == 0) {
            ioTools.getImages('nobulli', (images) => {
                noBulliImages = noBulliImages.concat(images);

                if (imgIndex < noBulliImages.length) {
                    callback(noBulliImages[imgIndex]);
                } else {
                    let random = tools.getRandom(0, noBulliImages.length);

                    callback(noBulliImages[random]);
                }
            });
        } else {
            if (imgIndex < noBulliImages.length) {
                callback(noBulliImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, noBulliImages.length);

                callback(noBulliImages[random]);
            }
        }
    }
    pickDreamyImage(callback, imgIndex) {
        if (dreamyImages.length == 0) {
            ioTools.getImages('dreamy', (images) => {
                dreamyImages = dreamyImages.concat(images);

                if (imgIndex < dreamyImages.length) {
                    callback(dreamyImages[imgIndex]);
                } else {
                    let random = tools.getRandom(0, dreamyImages.length);

                    callback(dreamyImages[random]);
                }
            });
        } else {
            if (imgIndex < dreamyImages.length) {
                callback(dreamyImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, dreamyImages.length);

                callback(dreamyImages[random]);
            }
        }
    }

    pickSlapImage(callback, imgIndex) {
        if (slapImages.length == 0) {
            ioTools.getImages('slap', (images) => {
                slapImages = slapImages.concat(images);

                if (imgIndex < slapImages.length) {
                    callback(slapImages[imgIndex]);
                } else {
                    let random = tools.getRandom(0, slapImages.length);

                    callback(slapImages[random]);
                }
            });
        } else {
            if (imgIndex < slapImages.length) {
                callback(slapImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, slapImages.length);

                callback(slapImages[random]);
            }
        }
    }

    pickPunchImage(callback, imgIndex) {
        if (punchImages.length == 0) {
            ioTools.getImages('punch', (images) => {
                punchImages = punchImages.concat(images);

                if (imgIndex < punchImages.length) {
                    callback(punchImages[imgIndex]);
                } else {
                    let random = tools.getRandom(9, punchImages.length);

                    callback(punchImages[random]);
                }
            });
        } else if (imgIndex < punchImages.length) {
            callback(punchImages[imgIndex]);
        } else {
            let random = tools.getRandom(0, punchImages.length);

            callback(punchImages[random]);
        }
    }

    pickKissImage(callback, imgIndex) {
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

    pickDanceImage(callback) {
        if (danceImages.length == 0) {
            ioTools.getImages('dance', (images) => {
                let random = tools.getRandom(0, images.length);

                danceImages = danceImages.concat(images);

                callback(danceImages[random]);
            });
        } else {
            let random = tools.getRandom(0, danceImages.length);

            callback(danceImages[random]);
        }
    }

    pickKaylaImage() {
        return new Promise((resolve, reject) => {
            if (kaylaImages.length == 0) {
                ioTools.getImages('kayla', images => {
                    let random = tools.getRandom(0, images.length);
                    kaylaImages = kaylaImages.concat(images);
                    resolve(kaylaImages[random]);
                });
            } else {
                let random = tools.getRandom(0, kaylaImages.length);
                resolve(kaylaImages[random]);
            }
        });
    }

    pickConfusedImage(callback) {
        if (confusedImages.length == 0) {
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

    pickJerryImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (jerryImages.length == 0) {
                ioTools.getImages('alcha', (images, filenames) => {
                    jerryImages = jerryImages.concat(images);
                    jerryFilenames = jerryFilenames.concat(filenames);

                    if (imgIndex < jerryImages.length) {
                        resolve({
                            file: jerryImages[imgIndex],
                            name: jerryFilenames[imgIndex]
                        });
                    } else {
                        let random = tools.getRandom(0, jerryImages.length);

                        resolve({
                            file: jerryImages[random],
                            name: jerryFilenames[random]
                        });
                    }
                });
            } else {
                if (imgIndex < jerryImages.length) {
                    resolve({
                        file: jerryImages[imgIndex],
                        name: jerryFilenames[imgIndex]
                    });
                } else {
                    let random = tools.getRandom(0, jerryImages.length);

                    resolve({
                        file: jerryImages[random],
                        name: jerryFilenames[random]
                    });
                }
            }
        });
    }

    pickPoutImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (poutImages.length == 0) {
                ioTools.getImages('pout', (images) => {
                    poutImages = poutImages.concat(images);

                    if (imgIndex < poutImages.length) {
                        resolve(poutImages[imgIndex]);
                    } else {
                        let random = tools.getRandom(0, poutImages.length);

                        resolve(poutImages[random]);
                    }
                });
            } else if (imgIndex < poutImages.length) {
                resolve(poutImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, poutImages.length);

                resolve(poutImages[random]);
            }
        });
    }

    pickDodgeImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (dodgeImages.length == 0) {
                ioTools.getImages('dodge', (images) => {
                    dodgeImages = dodgeImages.concat(images);

                    if (imgIndex < dodgeImages.length) {
                        resolve(dodgeImages[imgIndex]);
                    } else {
                        let random = tools.getRandom(0, dodgeImages.length);

                        resolve(dodgeImages[random]);
                    }
                });
            } else if (imgIndex < dodgeImages.length) {
                resolve(dodgeImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, dodgeImages.length);

                resolve(dodgeImages[random]);
            }
        });
    }

    pickLickImage(imgIndex) {
        return new Promise((resolve, reject) => {
            if (lickImages.length == 0) {
                ioTools.getImages('lick', (images) => {
                    lickImages = lickImages.concat(images);

                    if (imgIndex < lickImages.length) {
                        resolve(lickImages[imgIndex]);
                    } else {
                        let random = tools.getRandom(0, lickImages.length);

                        resolve(lickImages[random]);
                    }
                });
            } else if (imgIndex < lickImages.length) {
                resolve(lickImages[imgIndex]);
            } else {
                let random = tools.getRandom(0, lickImages.length);

                resolve(lickImages[random]);
            }
        });
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

    pickKillImage(callback, imgIndex) {
        if (killImages.length == 0) {
            ioTools.getImages('kill', (images) => {

                killImages = killImages.concat(images);

                if (imgIndex < killImages.length) {
                    callback(killImages[imgIndex]);
                } else {
                    let random = tools.getRandom(0, killImages.length);

                    callback(killImages[random]);
                }
            });
        } else if (imgIndex < killImages.length) {
            callback(killImages[imgIndex]);
        } else {
            let random = tools.getRandom(0, killImages.length);

            callback(killImages[random]);
        }
    }


    pickPatImage(callback, imgIndex) {
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