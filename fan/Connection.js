jsio('import server.Connection')

exports = Class(server.Connection, function(supr) {

	this.init = function() {
		supr(this, 'init', arguments)
		this._authenticatedUser = null
	}
	
	this.connectionMade = function() {
		supr(this, 'connectionMade', arguments)
		this.sendFrame('FAN_AUTHENTICATION_DEMAND')
	}
	
	this._sendAuthenticationResponse = function(userId, reason) {
		var response = { authenticated: !!userId }
		if (userId) { this._authenticatedUser = response.id = parseInt(userId) }
		else { response.reason = reason }
		this.sendFrame('FAN_AUTHENTICATION_RESPONSE', response)
	}
	
	this.frameReceived = function(id, name, args) {
		switch(name) {
			case 'FAN_AUTHENTICATION_REQUEST':
				this.server.authenticate(args.email, args.password_hash, bind(this, function(userId, reason) {
					this._sendAuthenticationResponse(userId, reason)
				}))
				break;
			case 'FAN_REQUEST_CREATE_USER':
				this.server.createUser(args.email, args.password_hash, this, bind(this, function(userId, reason) {
					this._sendAuthenticationResponse(userId, reason)
				}))
				break;
			default:
				if (this._authenticatedUser) { supr(this, 'frameReceived', arguments) }
				else { this.sendFrame('FAN_AUTHENTICATION_DEMAND') }
		}
	}
	
	this.getUser = function() { return this._authenticatedUser }
})

