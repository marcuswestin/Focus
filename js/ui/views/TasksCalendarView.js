var View = require('./View')

module.exports = Class(View, function(supr) {
	
	this._width = 650
	
	this._createBody = function() {
		this._create({ text:'calendar', parent:this._body })
	}
})
