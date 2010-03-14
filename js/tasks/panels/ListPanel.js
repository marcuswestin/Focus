jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')
jsio('import ui.Button')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ListPanel'
	this._width = 260
	this._left = 150
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		var taskButton = new ui.Button('Create new task')
		taskButton.subscribe('Click', bind(fin, 'createItem', { type: 'task' }, function(item) {
			gItemPanel.setItem(item)
		}))
		taskButton.appendTo(this._element)
		
		this.hide()
	}
	
	this.loadList = function(listView) {
		this._content.innerHTML = ''
		listView.appendTo(this._content)
		listView.subscribe('Click', bind(this, '_onCellClick'))
		
		// TODO We need to release the odld item set
		this.show()
	}
	
	this._onCellClick = function(itemCell) {
		var item = fin.getItem(itemCell.getId())
		gItemPanel.setItem(item)
	}
})