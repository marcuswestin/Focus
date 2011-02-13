var Class = require('../Class'),
	ValueView = require('./Value'),
	Component = require('../ui/Component')

module.exports = Class(ValueView, function(supr) {
	
	this._className += ' Editable'
	this._padding = 4
	this._border = 2
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(this, '_onClick'))
		this._on('mouseover', bind(this, 'addClassName', 'hot'))
		this._on('mouseout', bind(this, 'removeClassName', 'hot'))
		this._makeFocusable()
	}
	
	this.handleKeyboardSelect = function() {
		this._onClick()
	}
	
	this._onClick = function() {
		var input = this._input = fin.createView('Input', this._itemId, this._property),
			inputEl = input.getElement()
		
		inputEl.style.position = 'absolute'
		inputEl.style.overflow = 'hidden'
		inputEl.style.padding = this._padding + 'px'
		inputEl.style.paddingRight = 0 // so that the text inside the input box doesn't wrap around by hitting the end of the input box
		
		inputEl.style.fontSize = this.getStyle('font-size');
		inputEl.style.fontFamily = this.getStyle('font-family');
		inputEl.style.fontWeight = this.getStyle('font-weight');
		inputEl.style.lineHeight = this.getStyle('line-height');
		
		this._releaseFocus = fin.focus(this._itemId, this._property, bind(this, '_onBlur'))
		this._resizeInput()
		
		input
			.subscribe('Blur', this, '_onBlur')
			.appendTo(document.body)
			.focus()
	}
	
	this._onBlur = function(focusInfo) {
		this._releaseFocus()
		this._input
			.remove()
			.release()
		
		if (focusInfo && focusInfo.user) {
			var text = 'The focus of the property "' + this._property + '" was taken by another user, ',
				style = { marginRight: '4px' },
				msgNode = this._create({ text: text, style: style })
			
			new Component('span')
				.reflect(focusInfo.user, 'name', { pre: ' ' })
				.appendTo(msgNode)
			
			fan.util.notify(msgNode)
		}
	}
	
	this.setValue = function(value) {
		supr(this, 'setValue', arguments)
		
		if (!value) {
			this._content.innerHTML = 'Click to edit ' + this._property
			this.addClassName('defaultValue')
		} else {
			this.removeClassName('defaultValue')
		}
		
		this._resizeInput()
	}
	
	this._resizeInput = function() {
		if (!this._input) { return; }
		
		var layout = this.getLayout(this._content),
			padding = this._padding,
			border = this._border
		
		layout.x -= (padding + border)
		layout.y -= (padding + border)
		layout.h += padding * 2 + border * 2
		layout.w += padding * 2 + border * 2 + 5
		
		this._input.layout(layout)
		gKeyboardFocus.updatePosition(false)
	}
})