jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.List')
jsio('import fan.time')

exports = Class(fan.ui.lists.List, function(supr){
	
	this._className += ' CalendarList'
	
	this.init = function() {
		supr(this, 'init', [bind(this, '_makeCell')])
		this._groupsById = {}
		this._groupByLabel = []
		this._offsetReleaseFn = {}
	}
	
	this.addGroup = function(label) {
		var el = this._create({ className: 'group', html: '&nbsp;', parent: this.getElement() })
		this._groupByLabel[label] = el
		return this
	}
	
	this._addItem = function(itemId) {
		this._items.push(itemId)
		fin.observe(itemId, 'date', bind(this, '_onDateChange', itemId));
		return itemId
	}
	
	this._onDateChange = function(itemId, op, timestamp) {
		var releaseFns = this._offsetReleaseFn
		if (releaseFns[itemId]) { releaseFns[itemId]() }
		releaseFns[itemId] = fan.time.getDayOffset(timestamp, bind(this, '_onDayOffset', itemId))
	}
	
	this._onDayOffset = function(itemId, dayOffset) {
		var group, 
			groups = this._groupByLabel,
			cell = this._cells[itemId]
		
		if (dayOffset == 0) { group = groups['Today'] }
		else if (!dayOffset) { group = groups['Unscheduled'] }
		else if (dayOffset < 0) { group = groups['Overdue'] }
		else if (dayOffset == 1) { group = groups['Tomorrow'] }
		else if (dayOffset >= 2) { group = groups['Even later'] }
		
		group.appendChild(cell)
	}
	
	this._makeCell = function(itemId) {
		var cell = this._create({ className: 'cell' }),
			template = '<div class="title">(( Value title ))</div>'
		
		cell.delegateId = itemId
		cell.appendChild(fin.applyTemplate(template, itemId))
		return cell
	}
})
