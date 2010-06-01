jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr){
	
	this._className = 'List'
	
	this.init = function(makeCellFn) {
		supr(this, 'init')
		this._cells = {}
		this._items = []
		this._makeCellFn = makeCellFn
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
	
	this.setItems = function(items) {
		this._items = items;
		if (!this._element) { return }
		this._element.innerHTML = ''
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
			var itemId = item.getId ? item.getId() : item.timestamp // hack for lists with items that don't have a getId method
			if (!cells[itemId]) {
				cells[itemId] = this._makeCellFn(item)
				this._makeFocusable(cells[itemId])
			}
			this._element.appendChild(cells[itemId])
		}
	})
	
	this.handleKeyboardSelect = function(cell) {
		this._onClick(cell['delegateId'], cell)
	}
})