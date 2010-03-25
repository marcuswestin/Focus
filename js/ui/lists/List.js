jsio('from shared.javascript import Class, bind')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr){
	
	this._className = 'List'
	
	this.init = function() {
		supr(this, 'init')
		this._cells = {}
		this._items = []
	}
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_publish', 'Click'))
		this._render()
	}
	
	// this._onDrag = function() {
	// 	this._item.mutate({ property: this._property, from: 2, to: 4 })
	// }
	
	this.setItems = function(items) {
		this._items = items
		if (!this._element) { return }
		this._element.innerHTML = ''
		this._render()
	}
	
	this._render = function() {
		if (!this._element || !this._items) { return }
		for (var i=0, item; item = this._items[i]; i++) {
			var id = item.getId ? item.getId() : item
			if (!this._cells[id]) {
				this._cells[id] = this._getCellFor(item)
				this._cells[id].delegateId = item
			}
			this._insertElement(this._cells[id], i)
		}
	}
	
	this._getCellFor = function(itemId) {
		var text = itemId.replace(/_/g, ' '),
			className = 'item ' + itemId.toLowerCase().replace(/ /g, '-')
		return this._create({ parent: this._element, className: className, text: text })
	}
})