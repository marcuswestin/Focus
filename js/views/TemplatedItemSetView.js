jsio('from common.javascript import Class, bind')
jsio('import ui.ClickableList')

exports = Class(ui.ClickableList, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init')
		var conditions = jsArgs[0]
		this._type = conditions.type
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
	
	this._getCellFor = function(itemId) {
		var container = this._create({ className: 'cellContainer'})
		
		gUtil.loadTemplate(this._type + '-listCell', bind(this, function(template) {
			container.appendChild(fin.applyTemplate(template, itemId))
		}))
		
		return container
	}
})