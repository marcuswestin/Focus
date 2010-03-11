jsio('from common.javascript import Class, bind')
jsio('import ui.ClickableList')

exports = Class(ui.ClickableList, function(supr){
	
	this.init = function(items, references) {
		supr(this, 'init')
		var reference = references[0] // only take one argument
		this._property = reference.property
		this._item = items[reference.item]
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._item.addDependant(this._property, bind(this, '_onPropertyUpdated'))
	}
	
	this._onPropertyUpdated = function(items, mutation) { 
		// mutation.from, mutation.to
		this.setItems(items)
	}
})