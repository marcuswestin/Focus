jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr){
	
	this._className = 'List'
	
	this.init = function(makeCellFn) {
		supr(this, 'init')

		this._makeCellFn = makeCellFn
		this._cells = {}
		this._items = []
		this._itemsById = {}
	}
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_onClick'))
		this._render()
	}
	
	this._onClick = function(cellId, element) {
		this.unselect()
		this._selectedElement = element
		this.addClassName(this._selectedElement, 'selected')
		this._publish('Click', cellId, element)
	}
	
	this.unselect = function() {
		if (this._selectedElement) { 
			this.removeClassName(this._selectedElement, 'selected') 
		}
	}
	
	this.addItems = function(itemIds) {
		var byId = this._itemsById
		for (var i=0, itemId; itemId = itemIds[i]; i++) {
			if (byId[itemId]) { continue }
			byId[itemId] = this._addItem(itemId)
		}
		this._render()
	}
	
	this.removeItems = function(removeItemIds) {
		// this n*m loop could be made more efficient...
		for (var i=0, removeItemId; removeItemId = removeItemIds[i]; i++) {
			if (!this._itemsById[removeItemId]) { continue }
			for (var j=0, item; item = this._items[j]; j++) {
				var itemId = this._getItemId(item)
				if (itemId != removeItemId) { continue }
				this._removeItem(itemId, j);
				break
			}
		}
		this._render()
	}

	this._removeItem = function(itemId, itemsIndex) {
		this._items.splice(itemsIndex, 1)
		delete this._itemsById[itemId]
		if (this._cells[itemId]) { this.remove(this._cells[itemId]) }
		delete this._cells[itemId]
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
			var itemId = this._getItemId(item)
			
			if (!cells[itemId]) {
				cells[itemId] = this._makeCellFn(item)
				this._makeFocusable(cells[itemId])
			}
			var parent = this._getParentFor(itemId)
			if (parent) { parent.appendChild(cells[itemId]) }
		}
	})
	
	this._getParentFor = function() { return this._element }
	
	this._getItemId = function(item) {
		return item.getId ? item.getId() 
				: item.timestamp ? item.timestamp
				: item
	}
	
	this.handleKeyboardSelect = function(cell) {
		this._onClick(cell['delegateId'], cell)
	}
})