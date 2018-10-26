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
app.use(express.static('public'))

function get_accesstoken(callback){
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
    return callback(body.access_token)
})    
}

function search(search_term, callback){
    get_accesstoken(function(access_token){
        search_request(search_term, access_token, function(result){
            return callback(result)
        })
    })
}

function search_request(search_term, access_token, callback){
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
            "q" : search_term,
            "type" : "track",
            "limit" : 20,
            "market" : "DE",
        }    
    },function(error, response, body){
       return callback(body)
    }) 
}

app.get("/", function(req, res) {
    if(req.query.search_term != null && req.query.search_term != ""){
       search(req.query.search_term, function(result){
            res.render("partyfy", {"items" : result.tracks.items}) 
            console.log(result.tracks.items)
         })  
    }
    else{
        res.render("partyfy", {"items" : null})
    }  
})

app.post("/", function(req, res){
    console.log("OKK")
    console.log(req.body)
    res.render("partyfy", {"items" : null})
})

app.listen(3000, function(){
    console.log('Example app lisiting on port 3000!')
})

