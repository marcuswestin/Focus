var ValueView = require('./Value')
	
module.exports = Class(ValueView, function(supr){
	
	this._domTag = 'input'
	this._domType = 'checkbox'
	this._className += ' Checkbox'
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._on('change', bind(this, '_checkValue'))
		this._makeFocusable()
	}
	
	this.handleKeyboardSelect = function() {
		this.setValue(!this._value)
		fin.set(this._itemId, this._property, this._value)
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		this._element.checked = this._value = value ? true : false
	}
	
	this.createDelayedMethod('_checkValue', function() {
		var isChecked = this._element.checked
		this._value = Boolean(isChecked)
		fin.set(this._itemId, this._property, this._value)
	})
})