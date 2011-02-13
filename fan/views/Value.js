var Component = require('../ui/Component')

module.exports = Class(Component, function(supr){
	
	this._className = 'Value'
	
	this.init = function(args) {
		supr(this, 'init')
		
		this._itemId = args[0]
		this._property = args[1]
	}
	
	this._createContent = function() {
		// var itemIds = this._itemIds
		
		// this._propertyChain = this._property.split('.')
		// var itemId = (typeof itemIds == 'number' ? itemIds : itemIds[this._propertyChain.shift()])
		this._content = this._create({ tag: this._valueTag, className: 'content', parent: this._element })
		fin.observe(this._itemId, this._property, bind(this, '_onItemMutation'))
	}
	
	this._onItemMutation = function(mutation, newValue) {
		this.setValue(newValue)
	}
	
	this.setValue = function(value) {
		this._value = value
		if (!value) { return }
		value = value.toString().replace(/\n/g, '<br />')
		value = value.replace(/ $/, '&nbsp;')
		this._content.innerHTML = value
	}
	
	this.release = function() {
		logger.warn("TODO implement release of views")
	}
})