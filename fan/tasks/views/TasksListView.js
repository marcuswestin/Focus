jsio('from shared.javascript import Class')
jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')
jsio('import fan.ui.lists.SortedList')


exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' TasksListView'
	
	this._buildHeader = function() {
		new fan.ui.RadioButtons()
			.addTextButton('Tasks', { done: false, backlog: false, type: 'task', user: gUserId, })
			.addTextButton('Backlog', { done: false, backlog: true, type: 'task', user: gUserId })
			.addTextButton('Done', { done: true, type: 'task', user: gUserId })
			.subscribe('Click', this, 'loadQuery')
			.appendTo(this._header)
			.select(0)
		
		new fan.ui.Button('New task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', gUtil, 'createNewTask', {}, bind(gItemPanel, 'viewTask'))
	}
	
	this.loadQuery = function(query) {
		if (this._listView) { logger.log("TODO Release view!") }
		this._body.innerHTML = ''
		this._listView = new fan.ui.lists.SortedList(bind(this, '_getCellFor'))
			.query(query)
			.sortBy('crucial')
			.groupBy('project', 'title')
			.addClassName('TaskList')
			.subscribe('Click', gItemPanel, 'viewTask')
			.appendTo(this._body)
	}
	
	this._getCellFor = function(item) {
		var itemId = item.getId(),
			cell = this._create({ className: 'cell' })
		
		cell.delegateId = itemId
		
		gUtil.withTemplate('task-list', bind(this, '_applyTemplate', cell, itemId))
		fin.observe(itemId, 'crucial', bind(this, '_onCellCriticalChange', cell))
		
		return cell
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
	
	this._onCellCriticalChange = function(cell, mutation, isCritical) {
		this.toggleClassName(cell, 'crucial', isCritical)
	}
})