jsio('from common.javascript import Class, map')
jsio('import tasks.panels.Panel')
jsio('import ui.lists.List')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' LabelsPanel'
	this._width = 150
	this._left = -8
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		// This can't be defined until gUser exists
		this._labelList = [{ 
			label: "My tasks", 
			view: ['SortedItemListView', { type: 'task', user: gUser }, 'priority'] 
		}, { 
		// 	label: "My projects", 
		// 	view: ['ListView', { item: gUser, property: 'projects' }]
		// }, { 
			label: "Projects", 
			view: ['SortedItemListView', { type: 'project' }, 'target_date']
		}, { 
			label: "Unassigned tasks", 
			view: ['SortedItemListView', { type: 'task', user: undefined }, 'priority']
		}, { 
			label: "All tasks", 
			view: ['SortedItemListView', { type: 'task' }, 'priority']
		}]
		
		for (var i=0, labelItem; labelItem = this._labelList[i]; i++) { // allow lookup by label
			this._labelList[labelItem.label] = labelItem
		}
		
		var list = new ui.lists.List()
		var labels = map(this._labelList, function(labelItem) { return labelItem.label })
		list.setItems(labels)
		list.subscribe('Click', bind(this, '_onClick'))
		this._content.appendChild(list.getElement())
	}
	
	this._onClick = function(labelId, element) {
		if (this._selectedElement) { this.removeClassName(this._selectedElement, 'selected') }
		this.addClassName(element, 'selected')
		this._selectedElement = element
		
		var labelItem = this._labelList[labelId]
		var view = fin.getView.apply(fin, labelItem.view)
		gListPanel.loadList(view)
	}
	
})