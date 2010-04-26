jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.SortedItemList')

exports = Class(fan.ui.lists.SortedItemList, function(supr){
	
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init', jsArgs)
		
		var conditions = jsArgs[0],
			template = jsArgs[2]
		
		this._type = conditions.type
		this._template = template
	}
	
	this._getCellFor = function(item) {
		var container = this._create({})
		
		if (this._template) {
			this._applyTemplate(container, item.getId(), this._template)
		} else {
			gUtil.loadTemplate(this._type, 'list', bind(this, '_applyTemplate', container, item.getId()))
		}
		
		return container
	}
	
	this._applyTemplate = function(container, itemId, template) {
		container.appendChild(fin.applyTemplate(template, itemId))
	}
})