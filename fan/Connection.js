jsio('import server.Connection')

exports = Class(server.Connection, function(supr) {

	this.init = function() {
		supr(this, 'init', arguments)
		this._authenticatedUser = null
	}
	
	this.connectionMade = function() {
		supr(this, 'connectionMade', arguments)
		this.sendFrame('FAN_DEMAND_AUTHENTICATION')
	}
	
	this.frameReceived = function() {
		if (!this._authenticatedUser) {
			this.sendFrame('FIN_DEMAND_AUTHENTICATION')
			return
		}
		supr(this, 'frameReceived', arguments)
	}
	
	this.getUser = function() { return this._authenticatedUser }
})

