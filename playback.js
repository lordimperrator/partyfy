var request = require('request')
var express = require('express')
var swig = require('swig-templates')
var bodyParser = require("body-parser");
 
// credentials are optional
var app = express()
var  clientId = 'a4053a069ef047e2a10c49745a218670'
var clientSecret = 'f0eb85659b3149c082893cd58aa3f9ec'


app.engine('html', swig.renderFile);
app.set('view engine', 'html')
app.set('views', __dirname + '\\views');
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 

app.get("/playback", function(req, res) {
    res.send("OK")
})