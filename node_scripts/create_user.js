var sys = require('sys')
var http = require('http')
require('../lib/fin/fin')

jsio.path.fan = '.'

jsio('import fan.sha1')

var facebookID = process.argv[2],
	password = process.argv[3],
	facebook = http.createClient(80, 'graph.facebook.com'),
	request = facebook.request('GET', '/' + facebookID, { 'host': 'graph.facebook.com' })

if (!facebookID || !password) {
	sys.puts("Usage: create_user.js <facebookID> <new password>")
	process.exit();
}

request.end();
request.addListener('response', function (response) {
	response.setEncoding('utf8');
	response.addListener('data', function (chunk) {
		var data = JSON.parse(chunk)
		createUser(facebookID, data.name, password)
	});
});

function createUser(facebookID, name, password) {
	fin.registerEventHandler('FAN_AUTHENTICATION_RESPONSE', function(response) {
		if (!response.authenticated) {
			sys.puts(response.reason)
		} else {
			sys.puts("Successfully created user " + name)
		}
		process.exit()
	})
	
	fin.connect(function() {
		var userProps = { facebookID: facebookID, password_hash: fan.sha1(password), name: name }
		fin.send('FAN_REQUEST_CREATE_USER', userProps)
	})
}
