jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' LabelsPanel'
	this._width = 150
	this._left = -8
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		var listView = fin.getView('List', gUser, 'labels')
		listView.subscribe('Click', bind(this, '_onClick'))
		this._content.appendChild(listView.getElement())
	}
	
	this._onClick = function(clickedItem) {
		gListPanel.loadList(clickedItem)
	}
	
})