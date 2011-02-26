var View = require('./View'),
	RadioButtons = require('../../ui/RadioButtons'),
	Button = require('../../ui/Button'),
	SortedList = require('../../ui/lists/SortedList'),
	util = require('../../util')

module.exports = Class(View, function(supr) {
	
	this._className += ' TasksListView'
	
	this._buildHeader = function() {
		new RadioButtons()
			// .addButton({ text: 'Tasks', payload: { status: {op:'!=', value:'done'}, type: 'task', user: gUserID } })
			// .addButton({ text: 'Today' })
			// .addButton({ text: 'Crucial' })
			// .addButton({ text: 'Backlog', payload: { status: 'backlog', type: 'task', user: gUserID } })
			// .addButton({ text: 'Done', payload: { status: 'done', type: 'task', user: gUserID } })
			// .subscribe('Click', this, 'loadQuery')
			// .appendTo(this._header)
			// .select(0)
		
		new Button('New task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', util, 'createNewTask', {}, bind(gItemPanel, 'viewTask'))
			
		this.loadList()
	}
	
	this.loadList = function() {
		if (this._listView) { log("TODO Release view!") }
		this._body.innerHTML = ''
		this._listView = new SortedList(bind(this, '_getCellFor'))
			.reflectSortedSet(gUserID, 'tasks')
			// TODO .sortBy('crucial')
			.groupBy('project', 'title')
			.addClassName('TaskList')
			.subscribe('Click', gItemPanel, 'viewTask')
			.appendTo(this._body)
	}
	
	this._getCellFor = function(item) {
		var itemID = item.getId(),
			cell = this._create({ className: 'cell' })
		
		cell.delegateId = itemID
		
		fin.observe(itemID, 'title', function(mutation, value) {
			cell.innerHTML = value
		})
		
		// util.withTemplate('task-list', bind(this, '_applyTemplate', cell, itemID))
		// TODO fin.observe(itemID, 'crucial', bind(this, '_onCellCriticalChange', cell))
		
		return cell
	}
	
	// this._onCellCriticalChange = function(cell, mutation, isCritical) {
	// 	this.toggleClassName(cell, 'crucial', isCritical)
	// }
})