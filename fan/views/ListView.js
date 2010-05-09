jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.List')

exports = Class(fan.ui.lists.List, function(supr){
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._item.addDependant(this._property, bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation, itemsArray) { 
		// mutation.from, mutation.to
		this.setItems(itemsArray)
	}
})