var request = require('request')
var express = require('express')
var swig = require('swig-templates')
 
// credentials are optional
var app = express()
var  clientId = 'a4053a069ef047e2a10c49745a218670'
var clientSecret = 'f0eb85659b3149c082893cd58aa3f9ec'

app.engine('html', swig.renderFile);
app.set('view engine', 'html')
app.set('views', __dirname + '\\views');

function get_accesstoken(search_term, res){
    request({
    url: "https://accounts.spotify.com/api/token",
    method : "Post",
    json: true,
    headers : 
    {
        "Content-Type" : "application/x-www-form-urlencoded", 
        "Authorization" : "Basic " + new Buffer(clientId+":"+clientSecret).toString('base64')
    },
    body : "grant_type=client_credentials"
    }, 
    function(error, response, body){
    var accesstoken = body.access_token
    search_request(search_term, res, accesstoken)
})    
}

function search(search_term, res){
    get_accesstoken(search_term, res)
}

function search_request(search_term, res, access_token){
    console.log(access_token);  
    request({
        url: "https://api.spotify.com/v1/search",
        method: "GET",
        json: true,
        headers : 
        {
            "Authorization" : "Bearer " + access_token,
            "Content-Type" : "application/json"
        },
        qs :
        {
            "q" : "Ding",
            "type" : "track",
            "limit" : 5,
            "market" : "DE",
        }    
    },function(error, response, body){
       //console.log(body.tracks.items)
       for(i in body.tracks.items){
           console.log(body.tracks.items[i].name)
           for(k in body.tracks.items[i].artists){
            console.log(body.tracks.items[i].artists[k].name)
           }
           console.log(body.tracks.items[i].album.images[0].url)
           console.log("OK")
           res.render('partyfy',{'Searchterm': "Seeeeeed"})
          
       }
    }) 
}

app.get("/", async function(req, res) {
    search(req.query.search_term, res)   
    console.log()
})

app.listen(3000, function(){
    console.log('Example app lisiting on port 3000!')
})

