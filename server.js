var engines = {
	development: './lib/fin/engines/development',
	redis: './lib/fin/engines/redis'
}
var finServer = require('./lib/fin/api/server'),
	authentication = require('./fan/authentication'),
	engine = require(engines['development'])

authentication.observe(finServer)

return finServer.start(engine)
