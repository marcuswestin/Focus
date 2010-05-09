jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr){
	
	this._domTag = 'span'
	this._className = 'Value'
	
	this.init = function(args) {
		supr(this, 'init')
		
		this._itemId = args[0]
		this._property = args[1]
	}
	
	this._createContent = function() {
		var itemIds = this._itemIds
		
		// this._propertyChain = this._property.split('.')
		// var itemId = (typeof itemIds == 'number' ? itemIds : itemIds[this._propertyChain.shift()])
		
		fin.observe(this._itemId, this._property, bind(this, '_onItemMutation'))
	}
	
	this._onItemMutation = function(mutation, newValue) {
		this.setValue(newValue)
	}
	
	this.setValue = function(value) {
		this._value = value
		if (typeof value == 'undefined') { return }
		if (typeof value == 'string') {
			value = value.replace(/\n/g, '<br />')
			value = value.replace(/ $/, '&nbsp;')
		}
		this._element.innerHTML = value
		var valueClassName = typeof value == 'string' ? value.replace(/ /g, '_') : value
		this._element.className = this._className + ' fin-Value-' + this._property + '-' + valueClassName
	}
	
	this.release = function() {
		logger.warn("TODO implement release of views")
	}
})