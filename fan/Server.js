jsio('import server.Server')

exports = Class(server.Server, function(supr) {
	
	// Stamp all mutations with the user who originated it
	this.mutateItem = function(mutation, origConnection) {
		mutation._user = origConnection.getUser()
		supr(this, 'mutateItem', arguments)
	}

})

