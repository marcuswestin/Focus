jsio('from common.javascript import Class, bind')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr){
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_publish', 'Click'))
		this._delegateOn('mouseover', bind(this, '_publish', 'MouseOver'))
		this._delegateOn('mouseout', bind(this, '_publish', 'MouseOut'))
		this._render()
	}
	
	// this._onDrag = function() {
	// 	this._item.mutate({ property: this._property, from: 2, to: 4 })
	// }
	
	this.setItems = function(items) {
		this._items = items
		this._render()
	}
	
	this._render = function() {
		if (!this._element) { return }
		this._element.innerHTML = ''
		if (!this._items || !this._items.length) { return }
		for (var i=0, itemId; itemId = this._items[i]; i++) {
			var cellElement = this._getCellFor(itemId)
			cellElement.delegateId = itemId
			this._element.appendChild(cellElement)
		}
	}
	
	this._getCellFor = function(itemId) {
		var text = itemId.replace(/_/g, ' ')
		return this._create({ parent: this._element, className: 'item', text: text })
	}
})