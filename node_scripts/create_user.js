var sys = require('sys')
require('../lib/fin/fin')

jsio.path.fan = '..'

jsio('import fan.sha1')

var email = process.argv[2]

fin.registerEventHandler('FAN_AUTHENTICATION_RESPONSE', function() {
	sys.puts("Sucessfully create user with email " + email)
	process.exit()
})

fin.connect(function() {
	fin.send('FAN_REQUEST_CREATE_USER', { email: email, password_hash: fan.sha1('123123') })
})
