// Mysql Setting
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);
connection.connect();

var NOTICE_TABLE = "notices";
var NOTICE_DESCRIPTION = "description";


// Slack Bot Setting
var RtmClient = require('@slack/client').RtmClient;

var token = "xoxb-81691979618-4EM01CWH906lIVux6TVCeIMa";

var rtm = new RtmClient(token, {logLevel: 'error'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
	console.log('Logged in as ${rtmStartData.self.name} of team name ${rtmStartData.team.name}');
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	// 메세지 받았을 때
	console.log('channel = ' + message.channel);
	console.log('message = ' + message.text);
	console.log('author = ' + message.user);

	var text = message.text;
	if (text.include("공지show")) {
		connection.query('SELECT * FROM ' + NOTICE_TABLE + ';', function(err, row, field) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				console.log(row);
				console.log(field);
			}
		});
	} else if (text.include("공지add")) {
		// connection.query('INSERT INTO ' + NOTICE_TABLE + ' ')
	}
});