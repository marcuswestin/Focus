jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr){
	
	this._domTag = 'span'
	this._className = 'Value'
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init')
		
		this._itemIds = jsArgs[0]
		this._property = viewArgs[0]
	}
	
	this._createContent = function() {
		this.setDependant(this._itemIds, this._property)
	}
	
	this.setDependant = function(itemIds, property) {
		if (this._item) { logger.warn("TODO unsubscribe from old item") }
		this._propertyChain = property.split('.')
		var itemId = (typeof itemIds == 'string' ? itemIds 
				: itemIds.getId ? itemIds.getId()
				: itemIds[this._propertyChain.shift()])
		this._item = fin.getItem(itemId)
		this._item.addDependant(this._propertyChain, bind(this, '_onItemMutation'))
	}
	
	this._onItemMutation = function(mutation, newValue) {
		this.setValue(newValue)
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		if (typeof value == 'string') {
			value = value.replace(/\n/g, '<br />')
			value = value.replace(/ $/, '&nbsp;')
		}
		this._element.innerHTML = value
		var valueClassName = typeof value == 'string' ? value.replace(/ /g, '_') : value
		this._element.className = this._className + ' fin-Value-' + this._property + '-' + valueClassName
	}
})