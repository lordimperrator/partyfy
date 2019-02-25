var request = require('request')
var express = require('express')
var swig = require('swig-templates')
var bodyParser = require("body-parser")
var mysql = require('mysql')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var datetime = require('node-datetime')
var cors = require('cors')
 
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

function save_user_data(username, email, authtoken, authcode){
	var query = "INSERT INTO wishlist_user (wishlist_user_name, wishlist_user_email) VALUES('"+ username +"', '"+ email + "')"
	con.query(query, function(err, result){
		console.log(result.insertId)
		var user_id_fk = result.insertId
		get_userid(authcode,function(result){
			var dt = datetime.create((Date.now() + 3000))
			var formatteddate = dt.format('Y-m-d H:M:S')
			console.log(formatteddate)
			var query = `INSERT INTO wishlist_spotifydata (wishlist_spotifyusername, wishlist_spotifyuserid, wishlist_spotifyauthtoken, wishlist_spotifyusertoken, wishlist_spotifyusertokenexpire, wishlist_user_id_fk)
				VALUES('`+ result.display_name +`','`+ result.id +`','`+ authtoken +`','`+ authcode +`','`+ formatteddate +`','`+user_id_fk+`')`
			con.query(query, function(err, result){
			console.log(query)
			})
		})				
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

function get_user_name(access_token, callback){
	request({
		url: "https://api.spotify.com/v1/me/player/devices",
		method: "GET",
		json: true,
		headers:
		{
			"Authorization" : "Bearer " + access_token,
			"Content-Type" : "application/json"
		}},function(error, response, result){
			console.log(result);
			callback(result.display_name)
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
			console.log(result)
			callback(result)		
		})
	//})
}

function validate_host_data(username, email, callback){
		if(username == ""){
			var compare_result = "EmptyUsername"
			callback(compare_result)
			return
		}
		if(email == ""){
			var compare_result = "EmptyEmail"
			callback(compare_result)
			return
		}
		var query = "SELECT wishlist_user_name, wishlist_user_email FROM wishlist_user WHERE wishlist_user_name = '"+ username +"' OR wishlist_user_email = '"+ email +"'"
		con.query(query, function(err, result, fields){
			if(result.length == 0){
				var compare_result = "OK"
			}else{
				if(result[0].wishlist_user_name == username)
				var compare_result = "Username"
				if(result[0].wishlist_user_email == email)
				var compare_result = "Email"
			}			
			callback(compare_result)
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

app.post("/api/authorize", function(req, res){
	console.log(req.body.token)
	if(req.body.token != undefined){
		get_user_token(req.body.token, function(result){    		 
			access_token = result.access_token
			if(access_token != undefined){
				resString = '{'			
				get_userid(access_token, function(result){				
				resString += '"username": "' + result.display_name + '",' +
				'"userId": "' + result.id + '",'				
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