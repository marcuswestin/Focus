require('../lib/fin/lib/js.io/packages/jsio')

var redis = require('../lib/fin/lib/redis-node-client/lib/redis-client')

jsio.addPath('./lib/fin/js', 'shared')
jsio.addPath('./lib/fin/js', 'server')
jsio.addPath('.', 'fan')

jsio('import fan.Server')
jsio('import fan.Connection')

var fanServer = new fan.Server(fan.Connection, redis)

fanServer.listen('csp', { port: 5555 }) // for browser clients
fanServer.listen('tcp', { port: 5556, timeout: 0 }) // for robots
