jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')
jsio('import ui.ClickableList')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ListPanel'
	this._width = 200
	this._left = 200
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._content.innerHTML = 'List'
	}
	
	this.loadList = function(listId) {
		if (this._itemSet) { this._itemSet.release() }
		
		this._itemSet = fin.getItemSet(
			listId == 'my_tasks' 	? { owner: gUser } :
			listId == 'milestones' 	? { type: 'milestone'} :
			listId == 'users' 		? { type: 'user' }
			: null)
		
		this._itemSet.addDependant(bind(this, '_onListChange'))
	}
	
	this._onListChange = function(mutation) {
		this._itemSet.getItems(bind(this, function(items) {
			var list = new ui.ClickableList()
			list.subscribe('Click', bind(this, '_onClickItem'))
			this._content.appendChild(list.getElement())
			list.setItems(items)
		}))
	}
	
	this._onClickItem = function(itemId) {
		
	}
})