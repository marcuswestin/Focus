jsio('import server.Connection')
jsio('import shared.keys')
jsio('import fan.time')
jsio('import fan.keys')

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
				this.server.createUser(args, this, bind(this, function(userId, reason) {
					this._sendAuthenticationResponse(userId, reason)
				}))
				break;
			default:
				if (this._authenticatedUser) { supr(this, 'frameReceived', arguments) }
				else { this.sendFrame('FAN_AUTHENTICATION_DEMAND') }
		}
	}
	
	this._subscriptionTimeouts = {}
	this._handleMutationRequest = function(mutation) {
		mutation.user = this._authenticatedUser
		supr(this, '_handleMutationRequest', arguments)
		var key = mutation.id,
			subscriptionTimeouts = this._subscriptionTimeouts,
			blockTime = 5 * fan.time.minutes
		
		if (!subscriptionTimeouts[key]) {
			subscriptionTimeouts[key] = setTimeout(function() { delete subscriptionTimeouts[key] }, blockTime)
			
			var keyInfo = shared.keys.getKeyInfo(key),
				itemId = keyInfo.id,
				mutatedProperty = keyInfo.property,
				subscribersKey = shared.keys.getItemPropertyKey(itemId, fan.keys.subscribers)
			
			// Don't create notifications for hidden properties
			if (mutatedProperty[0] == '_') { return }
			
			this.server.retrieveSet(subscribersKey, bind(this, function(subscribers) {
				var notificationJSON = JSON.stringify({
					user: mutation.user,
					id: itemId,
					property: mutatedProperty,
					time: mutation.time,
					guid: itemId + mutatedProperty + mutation.time
				})
				var notificationMutation = {
					user: 'system',
					op: 'listAppend',
					time: mutation.time, 
					args: [notificationJSON]
				}
				logger.info("Send notification mutation to", notificationMutation, subscribers)
				for (var i=0, userID; userID = subscribers[i]; i++) {
					notificationMutation.id = shared.keys.getItemPropertyKey(userID, fan.keys.notifications)
					this.server.mutateItem(notificationMutation, this)
				}
			}))
		}
	}
})
