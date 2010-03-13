jsio('from common.javascript import Class, bind')
jsio('import ui.ClickableList')

exports = Class(ui.ClickableList, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init')
		var conditions = jsArgs[0]
		this._itemSet = fin.getItemSet(conditions)
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._itemSet.addDependant(bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation) { 
		// mutation.from, mutation.to
		this._itemSet.getItems(bind(this, function(items){
			
			this.setItems(items)
		}))
	}
})