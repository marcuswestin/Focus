jsio('from shared.javascript import Class, bind')
jsio('import ui.lists.SortedItemList')

exports = Class(ui.lists.SortedItemList, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init', jsArgs)
		
		var conditions = jsArgs[0],
			template = jsArgs[2]
		
		this._type = conditions.type
		this._template = template
	}
	
	this._getCellFor = function(itemId) {
		var container = this._create({})
		
		if (this._template) {
			this._applyTemplate(container, itemId, this._template)
		} else {
			gUtil.loadTemplate(this._type + '-listCell', bind(this, '_applyTemplate', container, itemId))
		}
		
		return container
	}
	
	this._applyTemplate = function(container, itemId, template) {
		container.appendChild(fin.applyTemplate(template, itemId))
	}
})