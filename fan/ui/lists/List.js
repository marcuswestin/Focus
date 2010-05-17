jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr){
	
	this._className = 'List'
	
	this.init = function() {
		supr(this, 'init')
		this._cells = {}
		this._items = []
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
		if (!this._element || !this._items) { return }
		for (var i=0, item; item = this._items[i]; i++) {
			this._insertElement(this._getCellFor(item), i)
		}
	})
	
	this._getCellFor = function(label) {
		var cell = this._cells[label]
		
		if (cell) { return cell }
		var text = label.replace(/_/g, ' '),
			className = 'cell ' + label.toString().replace(/ /g, '-').toLowerCase()
		
		cell = this._create({ text: text, className: className })
		cell.delegateId = label
		
		return (this._cells[label] = cell)
	}
})