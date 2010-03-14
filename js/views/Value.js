jsio('from common.javascript import Class, bind')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr){
	
	this._domType = 'span'
	
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
	
	this._onItemMutation = function(mutation) {
		this.setValue(mutation.value)
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		value = value.replace(/\n/g, '<br />')
		value = value.replace(/ $/, '&nbsp;')
		this._element.innerHTML = value
	}
})