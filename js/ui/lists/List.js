var Component = require('../Component')

module.exports = Class(Component, function(supr){
	
	this._className = 'List'
	
	this._initialize = function(makeCellFn) {
		supr(this, '_initialize')

		this._makeCellFn = makeCellFn
		this._cells = {}
		this._items = []
		this._itemsById = {}
	}
	
	this.reflect = function(property) {
		property.observe(bind(this, function(item, op) {
			switch(op) {
				case 'push':    this.addItem(item)
				case 'unshift': this.addItem(item, true)
				case 'sadd':    this.addItem(item)
				case 'srem':    this.removeItem
			}
		}))
		return this
	}
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_onClick'))
		this._render()
	}
	
	this._onClick = function(delegateID, element) {
		var item = this._itemsById[delegateID]
		this.unselect()
		this._selectedElement = element
		this.addClassName(this._selectedElement, 'selected')
		this._publish('Select', item, element, delegateID)
	}
	
	this.unselect = function() {
		if (this._selectedElement) { 
			this.removeClassName(this._selectedElement, 'selected') 
		}
	}
	
	this.addItem = function(item, onTop) {
		var itemID = this._getID(item)
		if (onTop) { this._items.unshift(item) }
		else { this._items.push(item) }
		this._itemsById[itemID] = item
		this._render()
		return this
	}
	
	this._getID = function(item) {
		return item.getID ? item.getID()
			: item._id ? item._id
			: item
	}
	
	this.removeItems = function(removeItemIds) {
		// this n*m loop could be made more efficient...
		for (var i=0, removeItemId; removeItemId = removeItemIds[i]; i++) {
			if (!this._itemsById[removeItemId]) { continue }
			for (var j=0, item; item = this._items[j]; j++) {
				var itemID = this._getID(item)
				if (itemID != removeItemId) { continue }
				this._removeItem(itemID, j);
				break
			}
		}
	}

	this._removeItem = function(itemID, itemsIndex) {
		this._items.splice(itemsIndex, 1)
		delete this._itemsById[itemID]
		if (this._cells[itemID]) { this.remove(this._cells[itemID]) }
		delete this._cells[itemID]
		this._render()
	}
	
	this.append = function(items) {
		Array.prototype.push.apply(this._items, items)
		this._render()
	}
	this.prepend = function(items) {
		Array.prototype.unshift.apply(this._items, items)
		this._render()
	}
	
	this.createDelayedMethod('_render', function() {
		var items = this._items,
			cells = this._cells
		
		if (!this._element || !items) { return }

		for (var i=0, item; item = items[i]; i++) {
			var itemID = this._getID(item),
				cell = cells[itemID]
			
			if (!cell) {
				cell = this._makeCellFn(item)
				if (cell.getElement) { cell = cell.getElement() }
				cells[itemID] = cell
				this.addClassName(cell, 'cell')
				cell.delegateID = itemID
				this._makeFocusable(cell)
			}
			var parent = this._getParentFor(item)
			if (parent) { parent.appendChild(cell) }
		}
	})
	
	this._getParentFor = function() { return this._element }
	
	this.handleKeyboardSelect = function(cell) {
		this._onClick(cell['delegateID'], cell)
	}
})