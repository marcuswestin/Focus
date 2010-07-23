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
	
	this.reflectList = function(itemId, propertyName, reverse) {
		fin.observeList(itemId, propertyName, bind(this, function(mutation) {
			if (mutation.op == 'listAppend' || mutation.op == 'listPrepend') {
				this.addItems(mutation.args, reverse)
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
		this._publish('Click', item, element, delegateID)
	}
	
	this.unselect = function() {
		if (this._selectedElement) { 
			this.removeClassName(this._selectedElement, 'selected') 
		}
	}
	
	this.addItems = function(items, reverse) {
		var byID = this._itemsById
		for (var i=0, item; item = items[i]; i++) {
			var itemID = this._getItemId(item)
			if (byID[itemID]) { continue }
			this._addItem(itemID, item, reverse)
		}
		this._render()
	}
	
	this._addItem = function(itemID, item, reverse) {
		if (reverse) { this._items.unshift(item) }
		else { this._items.push(item) }
		this._itemsById[itemID] = item
		return item
	}
	
	this._getItemId = function(item) {
		return item.guid ? item.guid
				: item.getId ? item.getId()
				: item.id ? item.id
				: item.timestamp ? item.timestamp
				: item
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
			var itemId = this._getItemId(item),
				cell = cells[itemId]
			
			if (!cell) {
				cell = cells[itemId] = this._makeCellFn(item)
				cell.delegateId = itemId
				this._makeFocusable(cell)
			}
			var parent = this._getParentFor(item)
			if (parent) { parent.appendChild(cell) }
		}
	})
	
	this._getParentFor = function() { return this._element }
	
	this.handleKeyboardSelect = function(cell) {
		this._onClick(cell['delegateId'], cell)
	}
})