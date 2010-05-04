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
		var itemId = item.getId(),
			cell = this._cells[itemId]
		
		if (cell) { return cell }
		
		cell = this._create({ className: 'cell' })
		cell.delegateId = itemId
		
		if (this._template) {
			this._applyTemplate(cell, itemId, this._template)
		} else {
			gUtil.loadTemplate(this._type, 'list', bind(this, '_applyTemplate', cell, itemId))
		}
		
		return (this._cells[itemId] = cell)
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
})