var request = require('request')
var express = require('express')
var swig = require('swig-templates')
var bodyParser = require("body-parser")
var mysql = require('mysql')
 
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
 
var con = mysql.createConnection({
    host: "localhost",
    user: "webserver",
    password: "12345678",
    database: "webserver"
});

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

function get_user_token(token, callback){
    request({
        url: "https://accounts.spotify.com/api/token",
        method: "Post",
        json: true,
        headers :
        {
            "Authorization" : "Basic " + (new Buffer(clientId+":"+clientSecret).toString('base64'))
        },
        form :
        {
            grant_type : "authorization_code",
            code : token ,
            redirect_uri : "http://localhost:3000/playback"
        }
    }, function(error, response, body){
        return callback(body)
    })
}

function get_userid(token, callback)
{
    request({
        url : "https://api.spotify.com/v1/me",
        method: "GET",
        json: true,
        headers :
        {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }
    },function(error, response, body){
        return callback(body)
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

function create_playlist(token, user_id, callback){
    request({
        url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
        method: "Post",
        json: true,
        headers: 
        {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token     
        },
        body:
        {
            "name": "Test Playlist",
            "description": "Automated Generated Playlist",
            "public": false
        }
    }, function(error, response, body){
        callback(body)
    })
}

function add_track_toPlaylist(token, playlist_id, song_id){
    request({
        url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
        method: "Post",
        json: true,
        headers:
        {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token    
        },
        body:
        {
            "uris" : [song_id]
        }
    }, function(error, response, body){
        console.log("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks")
        console.log(body)
    })
}

function add_track_toWishlist(track_name, track_artist, track_uri){
    con.connect(function(err) {
        if(err) throw err
        console.log("Connected!")
        var query = "INSERT INTO wishlist_song (wishlist_song_name, wishlist_song_artist, wishlist_song_uri) VALUES('"+ track_name +"', '"+ track_artist +"', '"+ track_uri +"')"
        con.query(query, function(err, result){
            console.log("added")
        })
    })
}



var archived_result;

app.get("/", function(req, res) {
    console.log(req.headers.host)
    if(req.query.search_term != null && req.query.search_term != ""){
       search(req.query.search_term, function(result){
            archived_result = result;
            res.render("partyfy", {"items" : result.tracks.items, "alert" : false}) 
            //console.log(result.tracks.items)
         })  
    }
    else{
        res.render("partyfy", {"items" : null, "alert" : false})            
    }  
})

app.post("/", function(req, res){
    console.log(req.body.song_id)
    if(archived_result != null){
        res.render("partyfy", {"items" : archived_result.tracks.items, "alert" : true, "songname" : req.body.song_name})
    }else{
        res.render("partyfy", {"items" : null})
    }
    //var playlist_id = queue_playlist.uri.slice(queue_playlist.uri.lastIndexOf(":") + 1,queue_playlist.uri.length)
    add_track_toWishlist(req.body.song_name, req.body.song_artist, req.body.song_id)
})

app.listen(3000, function(){
    console.log('Example app lisiting on port 3000!')
})

var queue_playlist
var access_token

app.get("/playback", function(req, res){
    var authcode = req.query.code;
    //console.log(authcode);
    get_user_token(authcode, function(result){        
        console.log(result.access_token)
        access_token = result.access_token
        get_userid(access_token,function(result){
            res.send(result)
            create_playlist(access_token, result.id, function(result){
                queue_playlist = result;
                var playlist_id = result.uri.slice(result.uri.lastIndexOf(":") + 1,result.uri.length)
                
            })
        })
    })
})



var redirect_uri = "http://localhost:3000/playback"

app.get("/login", function(req, res){
    var scopes = 'user-read-private user-read-email user-read-birthdate playlist-modify-public playlist-modify-private';
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
})