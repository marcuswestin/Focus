jsio('from shared.javascript import Class, bind, delayedFunction')
jsio('import fan.ui.lists.List')

var SortableItem = Class(function() {
	this.init = function(item, sortBy) {
		this._item = item
		this._sortBy = sortBy
	}
	this.toString = function() { return this._item.getProperty(this._sortBy) }
	this.getId = function() { return this._item.getId() }
	this.getProperty = function(name) { return this._item.getProperty(name) }
})

exports = Class(fan.ui.lists.List, function(supr){
	
	this._className += ' SortedItemList'
	
	this.init = function(conditions, sortBy) {
		supr(this, 'init')
		this._conditions = conditions
		this._sortBy = sortBy
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._itemSet = fin.getItemSet(this._conditions)
		this._itemSet.addDependant(bind(this, '_onUpdated'))
	}
	
	this._onUpdated = function(mutation) { 
		if (mutation.add) { this._addItems(mutation.add) }
		if (mutation.remove) { this._removeItems(mutation.remove) }
		this._render()
	}
	
	this._addItems = function(itemIds) {
		
		for (var i=0, itemId; itemId = itemIds[i]; i++) {
			if (this._items[itemId]) { continue } // Hack: local item set changes can publish mutation twice
			var item = fin.getItem(itemId)
			this._items.push(new SortableItem(item, this._sortBy))
			this._items[itemId] = true // Hack: local item set changes can publish mutation twice
			item.addDependant(this._sortBy, bind(this, '_render'))
		}
	}
	
	this._removeItems = function(removeItemIds) {
		// this n*m loop could be made more efficient...
		for (var i=0, removeItemId; removeItemId = removeItemIds[i]; i++) {
			for (var j=0, item; item = this._items[j]; j++) {
				var itemId = item.getId()
				if (itemId != removeItemId) { continue }
				this._items.splice(j, 1)
				delete this._items[itemId] // Hack: local item set changes can publish mutation twice
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

