const application_root=__dirname,
    express = require("express"),
    path = require("path"),
    bodyparser=require("body-parser"),
    tc = require('./controllers');
const ctrl = new tc.Controlador();

var app = express();
app.use(express.static(path.join(application_root,"public")));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//Cross-domain headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.get('/',tc.sendStatic);

//app.get('/datasets',tc.sendDatasets);

//app.get('/dataset/:name',tc.sendLastPosts);


app.get('/',(req, res) => {

    res.sendFile('./public/index.html');

});

app.get('/public/:name',(req, res) => {

    let name = req.params.name;

    res.sendFile('./data/' + name + '.data');
});


app.post('/stream', (req, res) => {

    let name = req.body.name;
    let track = req.body.track;

    res.send(ctrl.createStream(name, track));

});


app.get('/stream/graph',(req, res) =>{
    ctrl.graphJSLD( (result) => {
        res.send(result.map(x => x.description).filter(x=>x!=null))
    });
});

app.get('/stream/:name/polarity', (req, res) => {

    let name = req.params.name;

    ctrl.getPolarity(name, (response) => {
        res.send(response)
    });

});



app.get('/stream/:name/words', (req, res) => {

    let name = req.params.name;
    let top = req.query.top;

    ctrl.firstWords(name, top, (response) => {
        res.send(response);

    });

});



app.get('/stream/:name/geo', (req, res) => {

    let name = req.params.name;
    ctrl.geoLocal(name, (result) => {
        res.send(result)
    });

});



app.get('/stream/:name', (req, res) => {
  
    let name = req.params.name;
    let n = req.query.limit;

    console.log(name, n);

    ctrl.lastN(name, n, (response) => {

        res.send(response);
    });

});

app.listen(8080, function () {console.log("the server is running")});


ctrl.warmup.once("warmup", _ => {
   console.log("Web server running on port 8080");
});

