var finServer = require('./lib/fin/api/server'),
	engine = require('./lib/fin/engines/development')

finServer
	.on('client_connect', _handleConnect)
	.on('client_disconnect', _handleDisconnect)
	.handleRequest('login', _handleLogin)

function _handleConnect(client) {
	client.send({ event: 'authenticate' })
}
function _handleDisconnect(client) {}
function _handleLogin(client, message) {
	console.log('todo: actually _handleLogin')
	client.send({ event:'authentication', data:{uid:1} })
}

return finServer.start(engine)
