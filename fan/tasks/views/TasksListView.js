var View = require('./View'),
	RadioButtons = require('../../ui/RadioButtons'),
	Button = require('../../ui/Button'),
	SortedList = require('../../ui/lists/SortedList'),
	util = require('../../util')

module.exports = Class(View, function(supr) {
	
	this._className += ' TasksListView'
	
	this._buildHeader = function() {
		new RadioButtons()
			.addButton({ text: 'Tasks', payload: { status: {op:'!=', value:'done'}, type: 'task', user: gUserId } })
			// .addButton({ text: 'Today' })
			// .addButton({ text: 'Crucial' })
			.addButton({ text: 'Backlog', payload: { status: 'backlog', type: 'task', user: gUserId } })
			.addButton({ text: 'Done', payload: { status: 'done', type: 'task', user: gUserId } })
			.subscribe('Click', this, 'loadQuery')
			.appendTo(this._header)
			.select(0)
		
		new Button('New task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', util, 'createNewTask', {}, bind(gItemPanel, 'viewTask'))
	}
	
	this.loadQuery = function(query) {
		if (this._listView) { logger.log("TODO Release view!") }
		this._body.innerHTML = ''
		this._listView = new SortedList(bind(this, '_getCellFor'))
			.query(query)
			// TODO .sortBy('crucial')
			.groupBy('project', 'title')
			.addClassName('TaskList')
			.subscribe('Click', gItemPanel, 'viewTask')
			.appendTo(this._body)
	}
	
	this._getCellFor = function(item) {
		var itemId = item.getId(),
			cell = this._create({ className: 'cell' })
		
		cell.delegateId = itemId
		
		fan.util.withTemplate('task-list', bind(this, '_applyTemplate', cell, itemId))
		// TODO fin.observe(itemId, 'crucial', bind(this, '_onCellCriticalChange', cell))
		
		return cell
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
	
	// this._onCellCriticalChange = function(cell, mutation, isCritical) {
	// 	this.toggleClassName(cell, 'crucial', isCritical)
	// }
})