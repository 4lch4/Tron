module.exports = {
    checkPerm: function(user, server) {
        if (server.owner.user.id == user.id) {
            return true
        }
        return server.member(user).roles.array().map(r => r.name == 'Chatmod' || r.name == 'Knight').includes(true)
    },
    batchContent: function(batch, indico) {
        return Promise.all(batch.map(a => indico.contentFiltering(a)))
    },
    splitArray: function(array, chunk) {
        let finalarray = [];
        let i, j, temparray;
        for (i = 0, j = array.length; i < j; i += chunk) {
            temparray = array.slice(i, i + chunk);
            finalarray.push(temparray);
        }
        return finalarray;
    },
    joinArray: function(arr) {
        let finalarr = [];
        arr.map(array => {
            array.map(v => {
                finalarr.push(v);
            });
        });
        return finalarr;
    }
}