require('../lib/fin/lib/js.io/packages/jsio')

var redis = require('../lib/fin/lib/redis-node-client/lib/redis-client')

jsio.path.shared = './lib/fin/js'
jsio.path.server = './lib/fin/js'
jsio.path.fan = '.'

jsio('import fan.Server')
jsio('import fan.Connection')

var fanServer = new fan.Server(redis, fan.Connection)

fanServer.listen('csp', { port: 5555 }) // for browser clients
fanServer.listen('tcp', { port: 5556, timeout: 0 }) // for robots
