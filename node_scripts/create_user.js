#!/usr/bin/env node

require('../lib/fin/lib/js.io/packages/jsio')

jsio.path.shared = './lib/fin/js/'
jsio.path.server = './lib/fin/js/'
jsio.path.client = './lib/fin/js/'
jsio.path.fan = '.'

jsio('import client.fin') // makes fin globally accesible
jsio('import fan.sha1')


fin.registerEventHandler('FAN_AUTHENTICATION_RESPONSE', function() {
	process.exit()
})

fin.connect(function() {
	fin.send('FAN_REQUEST_CREATE_USER', { email: process.argv[2], password_hash: fan.sha1('123123') })
})
