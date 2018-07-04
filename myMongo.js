const mng = require('mongoose');

const streamObj = {
    '@context': {
        name: String,
        creador: String,
        track: String,
        uri: String,
        _dt: String
    }
};

const Stream = mng.model('Stream', streamObj);
let promises = mng.connect('mongodb://victor:victor1@ds227481.mlab.com:27481/mydb');

class myMongoDB {

    constructor(dataDir) {

    }

    stjson(stream) {
        let str = new Stream(stream);
        str.save();
    }

    graphJSLD(callback) {
        Stream.find((err, streams) => {
            if (err) return console.error(err);
            callback(streams);
        })
    }

}//END CLASS

exports.myMongoDB = myMongoDB;