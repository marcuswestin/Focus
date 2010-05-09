jsio('from shared.javascript import Class, map')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.ui.lists.List')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' LabelsPanel'
	this._width = 150
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._setTitle("Welcome")

		this._createItems()
		this._createLists()
	}
	
	this._createItems = function() {
		this._items = {
			"My tasks": [{ type: 'task', user: gUserId, done: false }, 'priority'],
				"High-Pri": [{ type: 'task', user: gUserId, done: false, priority: ['<', 3] }, 'priority'],
				"Completed": [{ type: 'task', user: gUserId, done: true }, 'priority'],
				"Unassigned": [{ type: 'task', user: null }, 'priority'],
				"All tasks": [{ type: 'task' }, 'priority'],
			"Projects": [{ type: 'project' }, 'target_date']
				// Projects get added dynamically
		}
	}
	
	this._createLists = function() {
		var tasksList = new fan.ui.lists.List(),
			projectsList = fin.createView('SortedList', { type: 'project' }, 'title', '(( title ))'),
			taskLabels = []
		
		tasksList.subscribe('Click', bind(this, '_onListClick', projectsList)) // pass in other list for unselect
		projectsList.subscribe('Click', bind(this, '_onListClick', tasksList))
		
		for (var label in this._items) { taskLabels.push(label) }
		tasksList.setItems(taskLabels)
		
		this._content.appendChild(tasksList.getElement())
		this._content.appendChild(projectsList.getElement())
	}
	
	this._onListClick = function(otherList, selectedItem) {
		otherList.unselect()
		
		var preItem = this._items[selectedItem]
			query = preItem ? preItem[0] : { type: 'task', project: selectedItem.getId() },
			sortBy = preItem ? preItem[1] : 'priority',
		
		gListPanel.load(query, sortBy, preItem ? selectedItem : selectedItem.getProperty('title'))
	}
})