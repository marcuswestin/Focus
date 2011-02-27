var ValueView = require('./Value')

module.exports = Class(ValueView, function(supr){
	
	this._className += ' Conditional'
	
	this._initialize = function(args) {
		supr(this, '_initialize', arguments)
		
		this._ifTrue = args[2]
		this._ifFalse = args[3]
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		if (value) {
			this._element.innerHTML = this._ifTrue || ''
		} else {
			this._element.innerHTML = this._ifFalse || ''
		}
	}
})