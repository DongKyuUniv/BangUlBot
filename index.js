var RtmClient = require('@slack/client').RtmClient;

var token = "xoxb-81691979618-IKQmumklb99fc9a398CpTz82";

var rtm = new RtmClient(token, {logLevel: 'debug'});
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

	} else if (text.include("공지add")) {
		
	}
});