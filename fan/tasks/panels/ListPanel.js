jsio('from shared.javascript import Class')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.ui.Button')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' ListPanel'
	this._width = 260
	this._left = 170
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		var taskButton = new fan.ui.Button('Create new task')
		taskButton.subscribe('Click', bind(this, '_createItem'))
		taskButton.appendTo(this._element)
		
		this.hide()
	}
	
	this._createItem = function() {
		var data = { 
			type: 'task', 
			title: 'I need to...',
			user: gUserId, 
			done: false, 
			priority: 3, 
			remaining_time: 3 
		}
		fin.create(data, function(itemId) {
			gItemPanel.setItem(itemId)
		})
	}
	
	this.loadList = function(listView, title) {
		if (this._listView) { logger.warn("TODO: release current list view")}
		
		this._setTitle(title)
		
		this._content.innerHTML = ''
		this._listView = listView
		this._listView.appendTo(this._content)
		this._listView.subscribe('Click', bind(this, '_onCellClick'))
		
		this.show()
	}
	
	this._onCellClick = function(itemCell) {
		var item = fin.getItem(itemCell.getId())
		gItemPanel.setItem(item)
	}
})