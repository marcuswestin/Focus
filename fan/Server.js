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
		
		this._redisClient.setnx(idToKey, '__fan_tmp_holder', bind(this, function(err, wasCreated) {
			if (err) { throw logger.error('Could not create user email to id ', facebookID, idToKey, err) }
			if (!wasCreated) { 
				callback(null, 'user with id ' + facebookID + ' already exists') 
				return
			}
			var userProps = { 'password_hash': passwordHash, 'facebookID': facebookID, 
				type: 'user', iconUrl: '//graph.facebook.com/' + facebookID + '/picture', name: name || facebookID }
			
			logger.log("Create user with items", userProps)
			this.createItem(userProps, origConnection, bind(this, function(newItemId) {
				this._redisClient.set(idToKey, newItemId, bind(this, function(err) {
					if (err) { throw logger.error('Could not update user email to id', idToKey, newItemId, err) }
					callback(newItemId)
				}))
			}))
		}))
	}
	
	this.authenticate = function(inputEmail, inputPasswordHash, callback) {
		if (!inputEmail || !inputPasswordHash) { return callback(null, 'Please give us both email and password') }
		var userIdKey = fan.keys.userEmailToId(inputEmail)
		
		this._redisClient.get(userIdKey, bind(this, function(err, userIdBytes) {
			if (err) { throw logger.error('Could not retrieve id for key', userIdKey, err) }
			if (!userIdBytes) { return callback(null, 'We couldn\'t find that email in our db') }
			var userId = userIdBytes.toString(),
				key = shared.keys.getItemPropertyKey(userId, 'password_hash')
			
			this._retrieveBytes(key, bind(this, function(passwordHash, key) {
				var response = (passwordHash == JSON.stringify(inputPasswordHash)) ? userId : null
				callback(response, 'That\'s not the right password')
			}))
		}))
	}
})
