jsio('from shared.javascript import Class, map')
jsio('import tasks.panels.Panel')
jsio('import ui.lists.List')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' LabelsPanel'
	this._width = 150
	this._left = -8
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._items = {
			"My tasks": [{ type: 'task', user: gUser.getId(), completed: false }, 'priority'],
				"High-Pri": [{ type: 'task', user: gUser.getId(), completed: false, priority: ['<', 3] }, 'priority'],
				"Completed": [{ type: 'task', user: gUser.getId(), completed: true }, 'priority'],
				"Unassigned": [{ type: 'task', user: false }, 'priority'],
				"All tasks": [{ type: 'task' }, 'priority'],
			"My projects": [{ type: 'project' }, 'target_date'],
				"Beta_1": [{ type: 'project', title: 'Beta_1' }, 'target_date'],
				"Cleanup": [{ type: 'project', title: 'Cleanup' }, 'target_date']
			// TODO Add all my projects to projects list
		}

		var list = new ui.lists.List()
		var labels = []
		for (var label in this._items) { labels.push(label) }
		list.setItems(labels)
		list.subscribe('Click', bind(this, '_onClick'))
		this._content.appendChild(list.getElement())
	}
	
	this._onClick = function(labelId, element) {
		if (this._selectedElement) { this.removeClassName(this._selectedElement, 'selected') }
		this.addClassName(element, 'selected')
		this._selectedElement = element
		
		var labelItem = this._items[labelId],
			query = labelItem[0],
			sortyBy = labelItem[1],
			view = fin.getView('SortedItemListView', query, sortyBy)
		
		gListPanel.loadList(view)
	}
	
})