var request = require('request')
var express = require('express')
var swig = require('swig-templates')
var bodyParser = require("body-parser")
var mysql = require('mysql')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var datetime = require('node-datetime')
var cors = require('cors')
const shortid = require('shortid');
 
// credentials are optional
var app = express()
var clientId = 'a4053a069ef047e2a10c49745a218670'
var clientSecret = 'f0eb85659b3149c082893cd58aa3f9ec'

app.engine('html', swig.renderFile);
app.set('view engine', 'html')
app.set('views', __dirname + '\\views');
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({secret: "12345678"}))

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$%')

app.use(cors())

var con = mysql.createConnection({
	host: "localhost",
	user: "webserver",
	password: "12345678",
	database: "webserver"
});

con.connect(function(err) {
	if(err) throw err
})

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
			redirect_uri : "http://localhost:4200/signin"
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

function get_user_devices(access_token, callback){
	request({
		url: "https://api.spotify.com/v1/me/player/devices",
		method: "GET",
		json: true,
		headers:
		{
			"Authorization" : "Bearer " + access_token,
			"Content-Type" : "application/json"
		}},function(error, response, result){
			callback(result)
		}
	)
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

function get_playlist_tracks(token, playlistid, callback){
	request({
		url: "https://api.spotify.com/v1/playlists/" + playlistid + "/tracks",
		method: "GET",
		json: true,
		headers: 
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token     
		},
		qs: 
		{	
			"fields" : "items(track(uri))",
			"limit" : 50
		}
	}, function(error, response, body){
		callback(body)
	})
}

function add_tracks_toPlaylist(token, playlist_id, tracks, callback){
	console.log(tracks)
	request({
		url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
		method: "Post",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"uris" : tracks
		}
	}, function(error, response, body){	
		console.log(error);
		callback()
	})
}

function add_track_toWishlist(track_name, track_artist, track_uri){
	var query = "INSERT INTO wishlist_song (wishlist_song_name, wishlist_song_artist, wishlist_song_uri) VALUES('"+ track_name +"', '"+ track_artist +"', '"+ track_uri +"')"
	con.query(query, function(err, result){
		console.log("added")
	})
}

function get_users_Playlists(token, callback){
	request({
		url: "https://api.spotify.com/v1/me/playlists",
		method: "GET",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"limit" : 50
		}
	}, function(error,response,result){
		callback(result)		
	})
	//})
}

function play_Playlist(token, playlisturi, deviceid){
	request({
		url: "https://api.spotify.com/v1/me/player/play",
		method: "PUT",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"device_id" : deviceid
		},
		body:
		{
			"context_uri" : playlisturi
		}
	}, function(error,response,result){
		console.log(result)		
	})
}

function set_Volume(token,volume,deviceid){
	request({
		url: "https://api.spotify.com/v1/me/player/volume",
		method: "PUT",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"device_id" : deviceid,
			"volume_percent": volume
		}		
	}, function(error,response,result){
		console.log(result)		
	})
}

function set_Repeat(token,deviceid) {
	request({
		url: "https://api.spotify.com/v1/me/player/repeat",
		method: "PUT",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"device_id" : deviceid,
			"state": "context"
		}		
	}, function(error,response,result){
		console.log(result)		
	})
}

function set_Shuffle(token,deviceid) {
	request({
		url: "https://api.spotify.com/v1/me/player/shuffle",
		method: "PUT",
		json: true,
		headers:
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token    
		},
		qs:
		{
			"device_id" : deviceid,
			"state": "false"
		}		
	}, function(error,response,result){
		console.log(result)		
	})
}

function get_Playlist(token,playlistid,callback) {
	request({
		url: "https://api.spotify.com/v1/playlists/" + playlistid,
		method: "GET",
		json: true,
		headers: 
		{
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + token     
		}		
	}, function(error, response, body){
		callback(body)
	})	
}

function save_spotify_data(userid, authtoken, refreshtoken, tokenduration, callback) {
	console.log(tokenduration)
	var dt = datetime.create((Date.now()))
	var formatteddate = dt.format('Y-m-d H:M:S')
	var query = `INSERT INTO wishlist_spotifydata (wishlist_spotifyuserid, wishlist_spotifyauthtoken, wishlist_spotifyrefreshtoken, wishlist_spotifyusertokenexpire)
	VALUES('`+ userid +`','`+ authtoken +`','`+ refreshtoken +`','`+ formatteddate +`')`
	con.query(query, function(err, result, fields){
		callback(result.insertId)
	})
}

function signup(userid, partyname, deviceid, originalplaylistid, partycode) {
	var query = `SELECT wishlist_spotifyuserid, wishlist_spotifyauthtoken FROM wishlist_spotifydata WHERE wishlist_spotifydata_id = ` + userid;
	con.query(query, function(err, result, fields){
		authtoken = result[0].wishlist_spotifyauthtoken;
		spotifyuserid = result[0].wishlist_spotifyuserid;
		create_playlist(authtoken, spotifyuserid, function(result) {
			var playlistid = result.id
			var playlisturi = result.uri
			get_playlist_tracks(authtoken,originalplaylistid,function(result){
				tracks = ''
				result.items.forEach(element =>{
					tracks += ''+ element.track.uri +','
				})
				if(tracks.charAt(tracks.length - 1) == ','){
					tracks = tracks.substring(0,tracks.length -1);
				}
				tracks += '';	
				add_tracks_toPlaylist(authtoken,playlistid,tracks, function(){
					set_Repeat(authtoken,deviceid);
					set_Shuffle(authtoken,deviceid)
					play_Playlist(authtoken,playlisturi,deviceid);
					set_Volume(authtoken,100,deviceid);
				});				
				query = `INSERT INTO wishlist_user (wishlist_spotifydata_id_fk, wishlist_user_device_id, wishlist_user_originalplaylist_id, wishlist_user_playlist_id, wishlist_user_partyname, wishlist_user_partycode)
				VALUES('`+ userid +`','`+ deviceid +`','`+ originalplaylistid +`','`+ playlistid +`','`+ partyname +`','`+ partycode +`')`
				con.query(query, function(err, result, fields){
					console.log(result);
				})
			})				
		})
	})
	
	

}


var archived_result;

app.route('/api/search/:term').get(function(req,res){
	const searchterm = req.params['term'];
	search(searchterm, function(result){
		console.log(result.tracks.items);		
		res.send(result.tracks.items);
	})
})

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

app.post("/api/signup", function(req,res){
	console.log(req.body);
	partycode = shortid.generate();
	console.log(partycode);
	signup(req.body.userid, req.body.partyname, req.body.deviceid, req.body.playlistid, partycode)
	res.send('{"code" : "' + partycode + '"}')
})

app.put("/api/wish", function(req,res){
	//console.log(req.body.code);
	var query = `SELECT wishlist_user_playlist_id, wishlist_spotifyauthtoken
		FROM wishlist_user
		LEFT JOIN wishlist_spotifydata
		ON wishlist_spotifydata_id_fk = wishlist_spotifydata_id
		WHERE wishlist_user_partycode = "`+ req.body.code +`"`;
		//console.log(query);
		con.query(query, function(err, result, fields){
			add_tracks_toPlaylist(result[0].wishlist_spotifyauthtoken,result[0].wishlist_user_playlist_id,req.body.uri, function(result){
				console.log(result)
			})
		})
})

app.post("/api/authorize", function(req, res){
	//console.log(req.body)
	if(req.body.token != undefined){
		get_user_token(req.body.token, function(result){    
			console.log(result)		 
			access_token = result.access_token
			refreshtoken = result.refresh_token
			duration = result.expires_in
			if(access_token != undefined){
				resString = '{'			
				get_userid(access_token, function(result){
					save_spotify_data(result.id,access_token, refreshtoken, duration, function(id){
						resString += '"username": "' + result.display_name + '",' +
						'"userId": "' + id + '",'				
						get_user_devices(access_token, function(result){									
							resString += '"devices": ['
							result.devices.forEach(element => {
								resString += '{"deviceName": "' + element.name + '",' +
								'"deviceId" : "' + element.id +'"},'
							});
							if(resString.charAt(resString.length - 1) == ','){
								resString = resString.substring(0,resString.length -1);
							}
							resString += '],'
							get_users_Playlists(access_token, function(result){
								resString += '"playlists": ['
								result.items.forEach(element => {
									resString += '{"playlistName": "' + element.name + '",' +
									'"playlistId" : "' + element.id + '"},'
								});
								if(resString.charAt(resString.length - 1) == ','){
									resString = resString.substring(0,resString.length -1);
								}
								resString += ']}'		
								console.log(resString)
								res.status(200).send(resString);
							});			
						})
					})									
				})		
			} else {
				res.status(400).send('token expiered')
			}			
		})		
	} else {
		res.status(400).send('no token given')
	}
})

var redirect_uri = "http://localhost:3000/host"

app.post("/host", function(req,res){
	if(req.body.submit_spotify){
		validate_host_data(req.body.host_username, req.body.host_email,function(state){
			if(state == "OK"){
				req.session.username = req.body.host_username
				req.session.email = req.body.host_email
				var scopes = 'user-read-private user-read-email user-read-birthdate playlist-modify-public playlist-modify-private user-read-playback-state';
				res.redirect('https://accounts.spotify.com/authorize' +
				'?response_type=code' +
				'&client_id=' + clientId +
				(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
				'&redirect_uri=' + encodeURIComponent(redirect_uri));
			}else{
				if(state == "Username"){
					res.render("host", {"alert" : true, "error" : "Username is already taken"})
				}
				if(state == "EmptyUsername"){
					res.render("host", {"alert" : true, "error" : "Not a valid username"})
				}
				if(state == "EmptyEmail"){
					res.render("host", {"alert" : true, "error" : "Not a valid email"})
				}
				if(state == "Email"){
					res.render("host", {"alert" : true, "error" : "Email is already taken"})
				}
			}
		})
	}
	if(req.body.submit_device){
		get_users_Playlists(req.session.username,function(result){
			res.render("host_playlist", {"items" : result.items});
		})
		
	}	
})





app.get("/login", function(req, res){
	var scopes = 'user-read-private user-read-email user-read-birthdate playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
	res.redirect('https://accounts.spotify.com/authorize' +
	'?response_type=code' +
	'&client_id=' + clientId +
	(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	'&redirect_uri=' + encodeURIComponent(redirect_uri));
})