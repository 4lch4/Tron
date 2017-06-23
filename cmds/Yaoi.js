const config = require('../util/config.json');

const tumblr = require('tumblr.js');
const client = tumblr.createClient({
    credentials: {
        consumer_key: config.tumblr.consumer_key,
        consumer_secret: config.tumblr.consumer_secret,
        token: config.tumblr.token,
        token_secret: config.tumblr.token_secret
    },
    returnPromises: true
});

const Tools = require('../util/Tools');
const tools = new Tools();

const blogUrls = [
    "yaoi-all-my-life.tumblr.com",
    "yaoiisaneed.tumblr.com",
    "fuckyeahexplicityaoi.tumblr.com",
    "secretyaoilover.tumblr.com",
    "yummy-yaoi.tumblr.com",
    "yaoi-gifs.tumblr.com"
];

class Yaoi {
    constructor(options) {
        this.options = options || {};
    }

    getYaoiPhoto() {
        return new Promise((resolve, reject) => {
            this.pickRandomBlog().then((url) => {
                this.pickRandomPost(url).then((post) => {
                    let random = tools.getRandom(0, post.photos.length);
                    
                    resolve(post.photos[random].original_size.url);
                });
            });
        });
    }

    pickRandomPost(url) {
        return new Promise((resolve, reject) => {
            client.blogPosts(url, {
                type: 'photo'
            }).then((data) => {
                let random = tools.getRandom(0, data.posts.length);

                resolve(data.posts[random]);
            });
        });
    }

    pickRandomBlog() {
        return new Promise((resolve, reject) => {
            tools.getPRandom(0, blogUrls.length).then((random) => {
                resolve(blogUrls[random]);
            });
        });
    }
}

module.exports = Yaoi;