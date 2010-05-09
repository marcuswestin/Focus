jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.SortedList')

exports = Class(fan.ui.lists.SortedList, function(supr){
	
	this.init = function(args) {
		supr(this, 'init', args)
		
		var conditions = args[0],
			template = args[2]
		
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