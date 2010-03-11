jsio('from common.javascript import Class, bind')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr){
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_onClick'))
		this._render()
	}
	
	this._onClick = function(clickedId) {
		this._publish('Click', clickedId)
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
		for (var i=0, item; itemValue = this._items[i]; i++) {
			var itemEl = this._create({ parent: this._element, className: 'item', text: itemValue })
			itemEl.delegateId = itemValue
		}
	}
})