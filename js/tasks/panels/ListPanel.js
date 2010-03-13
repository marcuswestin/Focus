jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')
jsio('import ui.ClickableList')
jsio('import ui.Button')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ListPanel'
	this._width = 260
	this._left = 150
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._createButton = new ui.Button()
		this.hide()
	}
	
	this.loadList = function(itemType, listView) {
		this._itemType = itemType
		this._createButton.setText('Create new ' + itemType)
		this._createButton.subscribe('Click', bind(this, '_createItem'))
		this._createButton.appendTo(this._element)
		
		this._content.innerHTML = ''
		listView.appendTo(this._content)
		listView.subscribe('Click', bind(this, '_onItemClick'))
		
		// TODO We need to release the odld item set
		this.show()
	}
	
	this._createItem = function() {
		fin.createItem({ type: this._itemType, user: gUser.getId() }, bind(this, function(item) {
			console.log("CREATED", arguments)
		}))
	}
	
	this._onItemClick = function(itemId) {
		gItemPanel.setItem(itemId)
	}
})