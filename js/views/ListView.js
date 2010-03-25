jsio('from shared.javascript import Class, bind')
jsio('import ui.lists.List')

exports = Class(ui.lists.List, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init')

	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._item.addDependant(this._property, bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation, itemsArray) { 
		// mutation.from, mutation.to
		this.setItems(itemsArray)
	}
})