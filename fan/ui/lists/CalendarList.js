jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.lists.List')
jsio('import fan.time')

exports = Class(fan.ui.lists.List, function(supr){
	
	this._className += ' CalendarList'
	
	this.init = function() {
		supr(this, 'init', [bind(this, '_makeCell')])
		this._groupsById = {}
		this._groupByLabel = []
		this._dateReleaseFn = {}
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
		if (!this._cells[itemId]) {
			setTimeout(recall(this, arguments))
			return
		}
		var releaseFns = this._dateReleaseFn
		if (releaseFns[itemId]) { releaseFns[itemId]() }
		releaseFns[itemId] = fan.time.getDayOffset(timestamp, bind(this, '_onDayOffset', itemId))
	}
	
	this._onDayOffset = function(itemId, dayOffset) {
		var group, groups = this._groupByLabel
		
		if (dayOffset == 0) { group = groups['Today'] }
		else if (!dayOffset) { group = groups['Unscheduled'] }
		else if (dayOffset < 0) { group = groups['Overdue'] }
		else if (dayOffset == 1) { group = groups['Tomorrow'] }
		else { group = groups['Even later'] }
		
		this._groupsById[itemId] = group
		group.appendChild(this._cells[itemId])
	}
	
	this._getParentFor = function(itemId) {
		return this._groupsById[itemId]
	}
	
	this._makeCell = function(itemId) {
		var cell = this._create({ className: 'cell' }),
			template = '<div class="title">(( Value title ))</div>'
		
		cell.delegateId = itemId
		cell.appendChild(fin.applyTemplate(template, itemId))
		return cell
	}
})
