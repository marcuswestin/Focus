jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.SortedList')

exports = Class(fan.ui.lists.SortedList, function(supr){
	
	this._className += ' TaskList'
	
	this._getCellFor = function(item) {
		var itemId = item.getId(),
			cell = this._cells[itemId]
		
		if (cell) { return cell }
		
		cell = this._create({ className: 'cell' })
		cell.delegateId = itemId
		this._makeFocusable(cell)
		
		gUtil.withTemplate('task', 'list', bind(this, '_applyTemplate', cell, itemId))
		fin.observe(itemId, 'crucial', bind(this, '_onCellCriticalChange', cell))
		
		return (this._cells[itemId] = cell)
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
	
	this._onCellCriticalChange = function(cell, mutation, isCritical) {
		this.toggleClassName(cell, 'crucial', isCritical)
	}
})