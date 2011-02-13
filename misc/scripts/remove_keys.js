#!/usr/bin/env node

var sys = require('sys'),
	redis = require('../lib/fin/lib/redis-node-client/lib/redis-client'),
	redisClient = redis.createClient(),
	deletePattern = 'your_key_pattern_goes_here' // '*@crucial', '*@backlog', '*@remaining_time'
	
redisClient.stream.addListener('connect', function() {
	redisClient.keys(deletePattern, function(err, keysBytes) {
		if (err) { throw 'Could not retrieve keys for pattern: ' + deletePattern }
		if (!keysBytes) { return }
		
		// This is really really ugly - keys are concatenated with commas. Split on ,I and then append
		//	an I in front of every key. This will break if there is a query with the string ",I" in a key or value
		var keys = keysBytes.toString().substr(1).split(',I') 
		for (var i=0, key; key = keys[i]; i++) {
			redisClient.del('I' + key, function(err) {
				if (err) { throw "Could not clear out key: " + key }
			})
		}
		sys.puts("ok, done")
		redisClient.close()
	})
})
