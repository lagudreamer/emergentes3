const mng = require('mongoose');

const streamObj = {
    '@context': {
        nombre: String,
        creador: String,
        consulta: String,
        data: String,
        url: String
        
    }
};

const Stream = mng.model('Stream', streamObj);

let promises = mng.connect('mongodb://victor:victor1@ds227481.mlab.com:27481/mydb');

class myMongo {

    
    constructor(dataDir) {

    }

    
    stjson(stream) {
        
        let str = new Stream(stream);
        str.save();
    }

    
    graphMG(callback) {
        
        Stream.find((err, streams) => {
            if (err) return console.error(err);
            callback(streams);
        })
    }

}

exports.myMongo = myMongo;
