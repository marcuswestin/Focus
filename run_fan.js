var engines = {
	development: './lib/fin/engines/development',
	redis: './lib/fin/engines/redis'
}
var finServer = require('./lib/fin/js/server/SocketServer'),
	authentication = require('./fan/authentication'),
	engine = require(engines['development'])

authentication.observe(finServer)

return finServer.start(engine)
