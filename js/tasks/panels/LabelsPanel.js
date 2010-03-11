jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' LabelsPanel'
	this._width = 180
	this._left = 0
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		var labels = ['My tasks']
		
		var listView = fin.getView('List', gUser, 'labels')
		listView.subscribe('Click', bind(this, '_onClick'))
		this._content.appendChild(listView.getElement())
	}
	
	this._onClick = function(clickedItem) {
		gListPanel.loadList(clickedItem)
	}
	
})