"use strict"

const config = require('../util/config.json');
const IOTools = require('../util/IOTools.js');
const Tools = require('../util/Tools.js');

const tools = new Tools();
const ioTools = new IOTools();

let spankImages = [];
let killImages = [];
let kissImages = [];
let kickImages = [];
let patImages = [];

class Reactions {
    constructor(options) {
        this.options = options || {};
    }

    pickKissImage(callback) {
        if (kissImages.length == 0) {
            ioTools.getImages('kiss', (images) => {
                let random = tools.getRandom(0, images.length);

                kissImages = kissImages.concat(images);

                callback(kissImages[random]);
            })
        } else {
            let random = tools.getRandom(0, kissImages.length);

            callback(kissImages[random]);
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

    pickPatImage(callback) {
        if (patImages.length == 0) {
            ioTools.getImages('pat', (images) => {
                let random = tools.getRandom(0, images.length);

                patImages = patImages.concat(images);

                callback(patImages[random]);
            })
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
        let images = [
            "https://i.imgur.com/Db0ghmE.gif", "https://i.imgur.com/rBYOkZq.gif",
            "https://i.imgur.com/gMylE3v.gif", "https://i.imgur.com/NeD9pVR.gif"
        ];

        let random = tools.getRandom(0, 4);

        callback({
            url: images[random]
        });
    }

    pickBiteImage(callback) {
        let images = [
            "https://i.imgur.com/2t4yRJL.gif", "https://i.imgur.com/pCRB4bm.gif",
            "https://i.imgur.com/A1UWYE0.gif", "https://i.imgur.com/TmUUJzF.gif",
            "https://i.imgur.com/T88sRvd.gif", "https://i.imgur.com/GV4mBag.gif",
            "https://i.imgur.com/wpQmQag.gif", "https://i.imgur.com/Yr6uo41.gif",
            "https://i.imgur.com/66aDTjt.gif", "https://i.imgur.com/DtMIIRp.gif",
            "https://i.imgur.com/CJ1kNDg.gif"
        ];

        let random = tools.getRandom(0, 11);

        callback({
            url: images[random]
        });
    }

    pickCryImage(callback) {
        let images = [
            "https://68.media.tumblr.com/56fea5a4d682cd26178c17d80f7ee82a/tumblr_ofedni0ELT1vztiw8o1_500.gif",
            "http://media1.giphy.com/media/yarJ7WfdKiAkE/giphy.gif", "https://media.tenor.co/images/15dd673b469356e2129a0be61c81c3e1/tenor.gif",
            "https://i.imgur.com/TCcBFhE.gif", "https://i.imgur.com/7fzgc54.gif",
            "https://i.imgur.com/nIquddi.gif", "https://i.imgur.com/i1Lff9D.gif",
            "https://i.imgur.com/hklN1Id.gif", "https://i.imgur.com/BKeoOk9.gif",
            "https://i.imgur.com/juYztHy.gif", "https://i.imgur.com/syTVAq2.gif",
            "https://i.imgur.com/fcwc3yf.gif", "https://i.imgur.com/tEcGeLo.gif",
            "https://i.imgur.com/LohoFnT.gif", "https://i.imgur.com/Mp24EZO.gif",
            "https://i.imgur.com/Ru8Lchl.gif", "https://i.imgur.com/msKl4QH.gif"
        ];

        let random = tools.getRandom(0, images.length);

        callback({
            url: images[random]
        });
    }

    pickRektImage(callback) {
        let images = ["https://media.giphy.com/media/vSR0fhtT5A9by/giphy.gif"]

        let random = tools.getRandom(0, images.length);

        callback({
            url: images[random]
        });
    }

    pickHugImage(callback) {
        let images = [
            "http://i.imgur.com/Lz2E3KQ.gif", "http://i.imgur.com/EjZ3EZF.gif",
            "http://i.imgur.com/9JkgObE.gif", "http://i.imgur.com/znBb48H.gif",
            "http://i.imgur.com/1DrVOy9.gif", "http://i.imgur.com/WisHWD1.gif",
            "http://i.imgur.com/cJ2UgeJ.gif", "http://i.imgur.com/Uv61Pc1.gif",
            "http://i.imgur.com/MdqyZwH.gif", "http://i.imgur.com/Zg7JRkI.gif",
            "http://i.imgur.com/MdqyZwH.gif", "http://i.imgur.com/PeGeJHx.gif",
            "http://i.imgur.com/UZKKA1p.gif", "http://i.imgur.com/3P9iz7F.gif",
            "http://i.imgur.com/zn43njB.gif", "http://i.imgur.com/RcE4Q39.gif",
            "http://i.imgur.com/gU4GyQW.gif", "http://i.imgur.com/1eijPRd.gif",
            "http://i.imgur.com/1eijPRd.gif", "http://i.imgur.com/qe9rhLw.gif",
            "http://i.imgur.com/VJrLyEK.gif", "http://i.imgur.com/SFfDubn.gif",
            "http://i.imgur.com/bwap4d8.gif", "http://i.imgur.com/C9ta1Sa.gif",
            "http://i.imgur.com/uJFvpy8.gif", "http://i.imgur.com/LE9wpHg.gif",
            "http://i.imgur.com/HN7xy34.gif", "http://i.imgur.com/Wlzh53b.gif",
            "http://i.imgur.com/0tFzfoS.gif", "http://i.imgur.com/toGIV2F.gif",
            "http://i.imgur.com/Hc4a4qy.gif", "http://i.imgur.com/t7jkk6Z.gif",
            "http://i.imgur.com/NTomm7O.gif", "http://i.imgur.com/qIRjVY5.gif",
            "http://i.imgur.com/Y2kcaZT.gif", "http://i.imgur.com/m8Dogv7.gif",
            "http://i.imgur.com/GaLRCro.gif", "http://i.imgur.com/hjLZk23.gif",
            "http://i.imgur.com/b9eQ6ZN.gif", "http://i.imgur.com/F34uEVD.gif",
            "http://i.imgur.com/QEvMlAf.gif", "http://i.imgur.com/fkDph6U.gif",
            "http://i.imgur.com/LQj1kvn.gif", "http://i.imgur.com/tcjdQI8.gif",
            "http://i.imgur.com/EnmebIW.gif", "http://i.imgur.com/RaCDnpI.gif",
            "http://i.imgur.com/5OWXPFe.gif", "https://i.imgur.com/ZGGijVt.gif"
        ];

        let random = tools.getRandom(0, images.length);

        callback({
            url: images[random]
        });
    }

    pickBlushImage(callback) {
        let images = [
            'https://i.imgur.com/TeK0xVr.gif', 'https://i.imgur.com/O85hPMc.gif', 'https://i.imgur.com/bLMZFxX.gif',
            'https://i.imgur.com/Bi2NBuI.gif', 'https://i.imgur.com/ns6jCfe.gif', 'https://i.imgur.com/ryThkzW.gif',
            'https://i.imgur.com/oy4objp.gif', 'https://i.imgur.com/1qdEuZd.gif', 'https://i.imgur.com/YV0C1p7.gif',
            'https://i.imgur.com/PWcQafM.gif', 'https://i.imgur.com/Yf6bxXP.gif', 'https://i.imgur.com/govlkd2.gif',
            'https://i.imgur.com/Y3qEgA9.gif', 'https://i.imgur.com/wXA6eEC.gif', 'https://i.imgur.com/3LrpXdI.gif',
            'https://i.imgur.com/oBtfUgJ.gif', 'https://i.imgur.com/jejjR3r.gif', 'https://i.imgur.com/jMJEBmu.gif',
            'https://i.imgur.com/QyfxIPl.gif', 'https://i.imgur.com/0JR3i83.gif', 'https://i.imgur.com/auT3qyB.gif',
            'https://i.imgur.com/tNgjyaU.gif', 'https://i.imgur.com/hbrF22m.gif', 'https://i.imgur.com/MawaNKI.gif',
            'https://i.imgur.com/cpz1EJz.gif', 'https://i.imgur.com/httCGTV.gif', 'https://i.imgur.com/IDFinuB.gif',
            'https://i.imgur.com/Ip7vqHc.gif', 'https://i.imgur.com/Sd33j3T.gif', 'https://i.imgur.com/5uswmLW.gif',
            'https://i.imgur.com/XlKMOtG.gif', 'https://i.imgur.com/sd7GS3C.gif', 'https://i.imgur.com/0ENFxMs.gif',
            'https://i.imgur.com/LMM959w.gif', 'https://i.imgur.com/AYKjFJn.gif', 'https://i.imgur.com/9rIYmT1.gif',
            'https://i.imgur.com/CYQyDnP.gif', 'https://i.imgur.com/TDcflKr.gif', 'https://i.imgur.com/rAj1g3h.gif',
            'https://i.imgur.com/HUYn6IX.gif', 'https://i.imgur.com/XqQviel.gif', 'https://i.imgur.com/ob9W3gT.gif',
            'https://i.imgur.com/mlBpkZK.gif', 'https://i.imgur.com/jKluGnJ.gif', 'https://i.imgur.com/xQaAA6G.gif',
            'https://i.imgur.com/yZi3E90.gif', 'https://i.imgur.com/3DYcQfC.gif'
        ];

        let random = tools.getRandom(0, images.length);

        callback({
            url: images[random]
        });
    }

    pickLoveImage(callback) {
        let images = [
            "https://i.imgur.com/588uYNB.gif", "https://i.imgur.com/hRUtMFz.gif",
            "https://i.imgur.com/Ph5N1xu.gif", "https://i.imgur.com/V3ba8a4.gif",
            "https://i.imgur.com/H9udxcZ.gif", "https://i.imgur.com/54JH1zA.gif",
            "https://i.imgur.com/l8cN0la.gif", "https://i.imgur.com/qxiFrH4.gif",
            "https://i.imgur.com/8Ey8xUy.gif", "https://i.imgur.com/n3BBfHk.gif",
            "https://i.imgur.com/zA2osmF.gif", "https://i.imgur.com/8elTnrB.gif",
            "https://i.imgur.com/pyZsB3o.gif", "https://i.imgur.com/mW7tRTA.gif",
            "https://i.imgur.com/qtauKz9.gif", "https://i.imgur.com/FYbmDhY.gif",
            "https://i.imgur.com/PrJ36Qe.gif", "https://i.imgur.com/Wf6lwwv.gif",
            "https://i.imgur.com/dX1ytFf.gif", "https://i.imgur.com/jFcU1AA.gif"
        ];

        let random = tools.getRandom(0, images.length);

        callback({
            url: images[random]
        });
    }
}

module.exports = Reactions;