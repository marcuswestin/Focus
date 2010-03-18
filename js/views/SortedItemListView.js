jsio('from common.javascript import Class, bind')
jsio('import ui.lists.SortedItemList')

exports = Class(ui.lists.SortedItemList, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init', jsArgs)
		
		var conditions = jsArgs[0]
		this._type = conditions.type
	}
	
	this._getCellFor = function(itemId) {
		var container = this._create({ className: 'cell' })
		
		gUtil.loadTemplate(this._type + '-listCell', bind(this, function(template) {
			container.appendChild(fin.applyTemplate(template, itemId))
		}))
		
		return container
	}
})