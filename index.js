var request = require('request');

// express
var express = require('express');
var app = express();
var server = app.listen(5000, function() {
	console.log('Server start');
	res.send('Hello world');
});

app.get('/', function(req, res) {
	console.log('Root');
	res.send('Hello world');
});

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

var TOKEN = "xoxb-81691979618-OWHso1Xi4z3plIDUhpgFjsnR";

var rtm = new RtmClient(TOKEN, {logLevel: 'error'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
	console.log('Logged in as ' + rtmStartData.self.name + ' of team name ' + rtmStartData.team.name);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	// 메세지 받았을 때
	console.log('channel = ' + message.channel);
	console.log('message = ' + message.text);
	console.log('author = ' + message.user);

	var text = message.text;
	if (text.includes("!add ")) {
		text = text.substr(5, text.length);
		console.log(text);
		connection.query('INSERT INTO ' + NOTICE_TABLE + ' VALUES(null, "' + text + '");', function(err, rows, field) {
			if (err) {
				console.log(err);
				throw err;
			}
		});
	} else if (text.includes("!reset")) {
		connection.query('DELETE FROM ' + NOTICE_TABLE + ';', function(err) {
			if (err) {
				console.log(err);
				throw err;
			}
		});
	} else if (text.includes("!show detail")) {
		connection.query('SELECT * FROM ' + NOTICE_TABLE + ';', function(err, row, field) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				if (row.length == 0) {
					rtm.sendMessage("공지사항 없음", message.channel);
				} else {
					for (var i = row.length - 1; i >= 0; i--) {
						rtm.sendMessage('_id = ' + row[i]._id + ', description = ' + row[i].description, message.channel);
					}
				}
			}
		});
	} else if (text.includes("!show")) {
		connection.query('SELECT * FROM ' + NOTICE_TABLE + ';', function(err, row, field) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				if (row.length == 0) {
					rtm.sendMessage("공지사항 없음", message.channel);
				} else {
					for (var i = row.length - 1; i >= 0; i--) {
						rtm.sendMessage(row[i].description, message.channel);
					}
				}
			}
		});
	} else if (text.includes("!delete ")) {
		var _id = text.substr(8, text.length);
		connection.query('DELETE FROM ' + NOTICE_TABLE + ' WHERE _id = ' + _id + ';', function(err) {
			if (err) {
				console.log(err);
				throw err;
			}
		});
	} else if (text.includes('!help')) {
		rtm.sendMessage("!add - 공지 추가\n!reset - 공지 리셋\n!show detail - 공지 디테일하게 보기\n!show - 공지 보기\n!delete n - _id가 n인 공지 삭제", message.channel);
	}
});



