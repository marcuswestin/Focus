var Publisher = require('./util').Publisher

var query = module.exports = new Publisher(),
	_location = window.location

query.getHash = function() { return _location.hash.substr(1) }
query.setHash = function(hash) { _location.hash = '#' + hash }

var currentHash = query.getHash()
setInterval(function() {
	var hash = query.getHash()
	if (hash == currentHash) { return }
	var oldHash = currentHash
	currentHash = hash
	query._publish('HashChanged', currentHash, oldHash)
}, 100)
