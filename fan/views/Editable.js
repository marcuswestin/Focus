jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')
jsio('import fan.ui.textViewEdit')

exports = Class(fan.views.Value, function(supr) {
	
	this._className += ' Editable'
	this._padding = 4
	this._border = 2
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(this, '_onClick'))
		this._makeFocusable()
	}
	
	this.handleKeyboardSelect = function() {
		this._onClick()
	}
	
	this._onClick = function() {
		var input = fin.createView('Input', this._itemId, this._property),
			inputEl = input.getElement()
		
		this._input = input
		
		inputEl.style.position = 'absolute'
		inputEl.style.overflow = 'hidden'
		inputEl.style.padding = this._padding + 'px'
		inputEl.style.paddingRight = 0 // so that the text inside the input box doesn't wrap around by hitting the end of the input box
		
		inputEl.style.fontSize = this.getStyle('font-size');
		inputEl.style.fontFamily = this.getStyle('font-family');
		inputEl.style.fontWeight = this.getStyle('font-weight');
		inputEl.style.lineHeight = this.getStyle('line-height');
		
		fin.focus(this._itemId, this._property, bind(this, '_onBlur'))
		input.subscribe('Blur', bind(this, '_onBlur'))
		
		this._resizeInput()
		input.appendTo(document.body)
		input.focus()
	}

	this.createDelayedMethod('_onBlur', function() {
		this._input.release()
		this._input.remove()
	})
	
	this.setValue = function(value) {
		supr(this, 'setValue', arguments)
		
		if (!value) {
			this._element.innerHTML = 'Click to edit ' + this._property
			this._element.className = this._className + ' defaultValue'
		}
		
		this._resizeInput()
	}
	
	this._resizeInput = function() {
		if (!this._input) { return; }
		
		var layout = this.getLayout()
		layout.left -= (this._padding + this._border)
		layout.top -= (this._padding + this._border)
		layout.height += this._padding * 2 + this._border * 2
		layout.width += this._padding * 2 + this._border * 2 + 5
		
		this._input.layout(layout)
	}
})