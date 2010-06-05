jsio('from shared.javascript import Class, bind, delayedFunction')
jsio('import fan.ui.lists.List')

var SortableItem = Class(function() {
	this.init = function(id) { this._id = id }
	this.getId = function() { return this._id }
	this.toString = function() { return (this._sortValue ? 0 : 1) + ':' + this._id }
	this.setSortValue = function(value) { this._sortValue = value }
})

exports = Class(fan.ui.lists.List, function(supr){
	
	this._className += ' SortedList'
	
	this.init = function(getCellFn, conditions, sortBy) {
		supr(this, 'init', arguments)
		this._conditions = conditions
		this._sortBy = sortBy
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		// TODO Release
		this._queryId = fin.query(this._conditions, bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation) { 
		if (mutation.op == 'sadd') { this.addItems(mutation.args) }
		if (mutation.op == 'srem') { this.removeItems(mutation.args) }
		this._render()
	}
	
	this._addItem = function(itemId) {
		var item = new SortableItem(itemId)
		fin.observe(itemId, this._sortBy, bind(this, '_onSortPropChange', itemId));
		this._items.push(item)
		this._itemsById[itemId] = item
		return item
	}
	
	this._onSortPropChange = function(itemId, op, value) {
		this._itemsById[itemId].setSortValue(value)
		this._render()
	}
	
	this.createDelayedMethod('_render', function() {
		this._items.sort()
		supr(this, '_render')
	})
})

