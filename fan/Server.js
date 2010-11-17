jsio('from shared.javascript import bind')
jsio('import server.Server')
jsio('import fan.sha1 as sha1')
jsio('import fan.keys')
jsio('import shared.keys')

exports = Class(server.Server, function(supr) {
	
	this.createUser = function(args, origConnection, callback) {
		var name = args.name,
			facebookID = args.facebookID,
			passwordHash = args.password_hash,
			idToKey = fan.keys.userEmailToId(facebookID)
		
		this._store.setIfNull(idToKey, '__fan_tmp_holder', bind(this, function(err, wasCreated) {
			if (err) { throw logger.error('Could not create user email to id ', facebookID, idToKey, err) }
			if (!wasCreated) { return callback(null, 'user with id ' + facebookID + ' already exists') }
			var userProps = { 'password_hash': passwordHash, 'facebookID': facebookID, 
				type: 'user', iconUrl: '//graph.facebook.com/' + facebookID + '/picture', name: name || facebookID }
			
			logger.log("Create user with items", userProps)
			this.createItem(userProps, origConnection, bind(this, function(newItemId) {
				this._store.set(idToKey, newItemId, bind(this, function(err) {
					if (err) { throw logger.error('Could not update user email to id', idToKey, newItemId, err) }
					callback(newItemId)
				}))
			}))
		}))
	}
	
	this.authenticate = function(inputEmail, inputPasswordHash, callback) {
		if (!inputEmail || !inputPasswordHash) { return callback(null, 'Please give us both email and password') }
		var userIdKey = fan.keys.userEmailToId(inputEmail)
		
		
		this._store.getBytes(userIdKey, bind(this, function(err, userIdBytes) {
			if (err) { throw logger.error('Could not retrieve id for key', userIdKey, err) }
			if (!userIdBytes) { return callback(null, 'We couldn\'t find that email in our db') }
			var userId = userIdBytes.toString(),
				key = shared.keys.getItemPropertyKey(userId, 'password_hash')
			
			this._retrieveBytes(key, bind(this, function(passwordHash, key) {
				var response = (passwordHash == JSON.stringify(inputPasswordHash)) ? userId : null
				callback(response, 'That\'s not the right password ' + passwordHash + ' ' + inputPasswordHash)
			}))
		}))
	}
	
	this.notifySubscribers = function(mutation) {
		var key = mutation.id,
			keyInfo = shared.keys.getKeyInfo(key),
			itemId = keyInfo.id,
			mutatedProperty = keyInfo.property,
			subscribersKey = shared.keys.getItemPropertyKey(itemId, fan.keys.subscribers)
		
		// Don't create notifications for hidden properties
		if (mutatedProperty[0] == '_') { return }
		
		this.retrieveSet(subscribersKey, bind(this, function(subscribers) {
			var notificationJSON = JSON.stringify({
				user: mutation.user,
				id: itemId,
				property: mutatedProperty,
				time: mutation.time,
				guid: itemId + mutatedProperty + mutation.time
			})
			var notificationMutation = {
				op: 'push',
				time: mutation.time, 
				args: [notificationJSON]
			}
			logger.info("Send notification mutation to", notificationMutation, subscribers)
			for (var i=0, userID; userID = subscribers[i]; i++) {
				notificationMutation.id = shared.keys.getItemPropertyKey(userID, fan.keys.notifications)
				this.mutateItem(notificationMutation)
			}
		}))
	}
})
