const db = require('./myStorage');

let DB = new db.myDB('./data');
const mongoDB = require('./myMongo');
//exports.sendStatic    = (req,res) => res.sendFile("public/index.html",{root:application_root});

//exports.sendDatasets  = (req,res) => res.send({result: DB.getDatasets()});

//exports.sendCounts    = (req,res) => res.send({error:"No operativo!"});

//exports.sendLastPosts = (req,res) => {
    //let n = (req.query.n == null) ? 10 : parseInt(req.query.n);
    //DB.getLastObjects(req.params.name,n,data => res.send(data));
//};

//pon aqui tus funciones adicionales!

const stream = require('./myStream');

let man = new stream.StreamManager();


class Controlador {

	constructor(){

		this.DB = new db.myDB('./data');
        this.mongo=new mongoDB.myMongoDB();
        this.warmup = this.DB.events;
	}

	createStream (name, track) {
		const json =this.jsonfuncion();
        this.mongo.stjson(json);
        man.createStream(name, track, json);
	};


	getPolarity (name, callback) {

        	this.DB.getLastObjects(name, 100, (response) => {

            	let polarities = {

                	positive: 0,
                	negative: 0,
                	neutral: 0
            	};

            	for (let i of response.result) {

                	if(i.polarity<0){
				
                    		polarities.negative += 1;


                	}

			else if(i.polarity<0){
				
                    		polarities.positive += 1;
                	}

			else{
                    		polarities.neutral += 1;
                	}
            	}

            	response.result = polarities;

            	callback(response);

        	});
    	};

	
	
	firstWords (name, top, callback) {


        	this.DB.getLastObjects(name, 50, (response) => {

			let dic = {};            		
			let list = [];



            		if (!response.result){

                		callback(response)

            		}

            	for (let i of response.result) {

                	let text = i.text.split(' ');

                	for (let j of text) {

                    		if(dic[j]) {

                        		dic[j] = dic[j] +1;
                    		} 

				else {
                        		dic[j] = 1;
                    		}
                	}
            	}

            	for (let i in dic){

                	list.push([i, dic[i]]);
            	}

            	list.sort((a, b) => {

                	return a[1] - b[1]
            	});

            	response.result = list.splice(0, top);

            	callback(response);

        	});
    	};

    	


    	geoLocal (name, callback){

        	this.DB.getLastObjects(name, 0, (response) => {

            	let localization = {};

            	for (let i of response.result) {

                	console.log(i);

                	if(i.coordinates != null){

                    		latitude =i.latitude;
                    		longitude = i.longitude;
                    		localization[i.id_str] = [latitude,longitude];
                	}
            	}

            	response.result = localization;

            	callback(response);


        	});
    	};


	/*lastN (name, n, callback) {

        	this.DB.getLastObjects(name, n, (response) => {

            		let nfinal = [];
            		let map = {};
            		if(!response.result){
            		    callback(response)
                    }

            		for (let i of response.result) {
                        let text = i.text.split(' ');
                        for (let word of text) {

                            if (map[word]) {
                                map[word] = map[word] + 1;
                            } else {
                                map[word] = 1;
                            }
                        }
                    }

                    for (let j in map){
                        nfinal.push([j, map[j]]);
            		}

            		nfinal.sort((elem1,elem2)=>{
            		    return elem2[1] - elem1[1]
                    } );

            		response.result = nfinal.splice(0, n);

            		callback(response);
        	});
	};*/

	lastN (name, n, callback) {

        	this.DB.getLastObjects(name, n, (response) => {

            		let nfinal = [];

            		for (let i of response.result) {

                		nfinal.push(i.id_str)
            		}

            		response.result = nfinal

            		callback(response);
        	});
	};

    jsonfuncion() {
        return {
            "@context": {
               "nombre":"http://schema.org/name", "consulta":"http://schema.org/query",
                "creador":"http://schema.org/agent", "_dt":"http://schema.org/startTime",
                "uri":"http://schema.org/url"

        }

    }}

    graphJSLD(callback){
        //this.DB.getSearchAction( (result) => {

    	this.mongo.graphJSLD( (result) => {
    		callback(result);
		});
    }
    	

}


exports.Controlador = Controlador;
