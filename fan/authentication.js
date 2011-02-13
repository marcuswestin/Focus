module.exports = {
	observe: observe
}

function observe(finServer) {
	finServer
		.on('client_connect', _handleConnect)
		.on('client_disconnect', _handleDisconnect)
		
	finServer.handleRequest('login', _handleLogin)
}


var _handleConnect = function(client) {
	client.send({ event: 'authenticate' })
}

var _handleDisconnect = function(client) {
	
}

var _handleLogin = function(client, message) {
	console.log('todo: actually _handleLogin')
	client.send({ event:'authentication', data:{uid:1} })
}
