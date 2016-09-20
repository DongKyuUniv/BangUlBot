var request = require('request');

// express
var express = require('express');
var app = express();

// Mysql Setting
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);
// var connection = mysql.createConnection({
// 	host : 'localhost',
// 	port: 3306,
// 	user: 'root',
// 	password: 'lee7945132',
// 	database: 'BangUlBot'
// });
connection.connect(function() {
	connection.query('CREATE TABLE IF NOT EXISTS notices(_id INT PRIMARY KEY AUTO_INCREMENT, description TEXT);', function(err) {
		if (err) {
			console.log(err);
			throw err;
		}
	});
});

var NOTICE_TABLE = "notices";
var NOTICE_DESCRIPTION = "description";


// Slack Bot Setting
var RtmClient = require('@slack/client').RtmClient;

var TOKEN = "xoxb-81691979618-cOcSmcLwlhvAVpyEiJsP4sSa";

var rtm = new RtmClient(TOKEN, {logLevel: 'error'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
	console.log('Logged in as ' + rtmStartData.self.name + ' of team name ' + rtmStartData.team.name);

	request.post(
	'https://slack.com/api/auth.test',
	{json: {token: TOKEN}}, 
	function (err, res, body) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			console.log('auth 응답');
			console.log(body);
		}
	}
);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	// 메세지 받았을 때
	console.log('channel = ' + message.channel);
	console.log('message = ' + message.text);
	console.log('author = ' + message.user);

	var text = message.text;
	if (text.includes("공지!")) {
		connection.query('SELECT * FROM ' + NOTICE_TABLE + ';', function(err, row, field) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				console.log(row[0].description);
				console.log(field);
				for (var i = row.length - 1; i >= 0; i--) {
					rtm.sendMessage(row[i].description, message.channel);
				}
			}
		});
	}
});


app.get('/', function(req, res) {
	console.log('Hello world');
	res.send('Hello world');
})


app.get('/addnotice', function(req, res) {
	console.log('add Notice !!');
	res.send('add Notice');
});
app.listen(5000);



