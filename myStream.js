
const Twitter = require('twitter')
const db = require('./myStorage');
const myCreds = require('./credentials/my-credential.json');


const client = new Twitter(myCreds);
const sentiment = require('sentiment-spanish');

let stream = client.stream('statuses/filter', {track: 'coches,opel,mercedes,bmw,seat,ford,citroen,peugeot'});

class StreamManager{
    constructor(){
        this.streams={};
        this.DB=new db.myDB('./data');
    }
    createStream(name,track, json){

        let stream = client.stream('statuses/filter', {track: track});
        this.streams[name]= stream;
        this.DB.createDataset(name, {track:track}, {json:json});
        let dataSet = stream.on('data', tweet => { 
			if (tweet.lang=="es" || tweet.user.lang=="es"){
                    	console.log(tweet.id,tweet.id_str,tweet.text,tweet.coordinates);
                    	console.log("Sentiment score:",sentiment(tweet.text).score);
                    	this.DB.insertObject(name, {id_str: tweet.id_str, text:tweet.text, coordinates:tweet.coordinates, polarity:sentiment(tweet.text).score})
                }
            });


        stream.on('error', err => console.log(err));

	//destruimos el stream despues de 20 segundos (solo para pruebas)
        setTimeout(() => {stream.destroy()}, 20000);
    }



    destroyStream(name){


        this.streams[name].destroy();
        delete this.streams[name];
    }
}

exports.StreamManager = StreamManager;
