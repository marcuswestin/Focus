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
	
	this.init = function(conditions, sortBy) {
		supr(this, 'init')
		this._conditions = conditions
		this._sortBy = sortBy
		this._itemsById = {}
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		// TODO Release
		this._queryId = fin.query(this._conditions, bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation) { 
		if (mutation.op == 'sadd') { this._addItems(mutation.args) }
		if (mutation.op == 'srem') { this._removeItems(mutation.args) }
		this._render()
	}
	
	this._addItems = function(itemIds) {
		for (var i=0, itemId; itemId = itemIds[i]; i++) {
			if (this._itemsById[itemId]) { continue }
			var item = new SortableItem(itemId)
			fin.observe(itemId, this._sortBy, bind(this, '_onSortPropChange', itemId));
			this._items.push(item)
			this._itemsById[itemId] = item
			this._render()
		}
	}
	
	this._onSortPropChange = function(itemId, op, value) {
		this._itemsById[itemId].setSortValue(value)
		this._render()
	}
	
	this._removeItems = function(removeItemIds) {
		// this n*m loop could be made more efficient...
		for (var i=0, removeItemId; removeItemId = removeItemIds[i]; i++) {
			if (!this._itemsById[removeItemId]) { continue }
			for (var j=0, item; item = this._items[j]; j++) {
				var itemId = item.getId()
				if (itemId != removeItemId) { continue }
				this._items.splice(j, 1)
				delete this._itemsById[itemId]
				if (!this._cells[itemId]) { break }
				this.remove(this._cells[itemId])
				delete this._cells[itemId]
				break
			}
		}
		
		this._render()
	}
	
	this.createDelayedMethod('_render', function() {
		this._items.sort()
		supr(this, '_render')
	})
})

