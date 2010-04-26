jsio('from shared.javascript import bind')
jsio('import server.Server')
jsio('import fan.sha1 as sha1')
jsio('import fan.keys')

exports = Class(server.Server, function(supr) {
	
	// Stamp all mutations with the user who originated it
	this.mutateItem = function(mutation, origConnection) {
		mutation._user = origConnection.getUser()
		supr(this, 'mutateItem', arguments)
	}
	
	this.createUser = function(inputEmail, inputPasswordHash, origConnection, callback) {
		var emailToIdKey = fan.keys.userEmailToId(inputEmail)
		this._redisClient.setnx(emailToIdKey, '__fan_tmp_holder', bind(this, function(err, wasCreated) {
			if (err) { throw logger.error('Could not create user email to id ', inputEmail, emailToIdKey, err) }
			if (!wasCreated) { 
				callback(null, 'user with email exists') 
				return
			}
			var userProps = { 'password_hash': inputPasswordHash, 'email': inputEmail, type: 'user' }
			logger.log("Create user with items", userProps)
			this.createItem(userProps, origConnection, bind(this, function(newItemId) {
				this._redisClient.set(emailToIdKey, newItemId, bind(this, function(err) {
					if (err) { throw logger.error('Could not update user email to id', emailToIdKey, newItemId, err) }
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
			var userId = userIdBytes.toString()
			
			this.getItemProperty(userId, 'password_hash', bind(this, function(passwordHash, key) {
				var response = (passwordHash == inputPasswordHash) ? userId : null
				callback(response, 'That\'s not the right password')
			}))
		}))
	}
})
