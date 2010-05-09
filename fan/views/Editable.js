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
	}
	
	this._onClick = function() {
		var input = fin.createView('Input', this._itemId, this._property),
			inputEl = input.getElement()
		
		input.appendTo(document.body)
		input.subscribe('Blur', bind(input, 'hide'))
		
		inputEl.style.position = 'absolute'
		inputEl.style.overflow = 'hidden'
		inputEl.style.padding = this._padding + 'px'
		inputEl.style.paddingRight = 0 // so that the text inside the input box doesn't wrap around by hitting the end of the input box
		
		inputEl.style.fontSize = this.getStyle('font-size');
		inputEl.style.fontFamily = this.getStyle('font-family');
		inputEl.style.fontWeight = this.getStyle('font-weight');
		inputEl.style.lineHeight = this.getStyle('line-height');
		
		input.focus()
		this._input = input
		fin.focus(this._itemId, this._property, bind(this, '_onRemoteBlur'))
		this._resizeInput()
	}

	this._onRemoteBlur = function() {
		this._input.release()
		this._input.remove()
	}
	
	this.setValue = function() {
		supr(this, 'setValue', arguments)
		this._resizeInput()
	}
	
	this._resizeInput = function() {
		if (!this._input) { return; }
		
		var layout = this.getLayout()
		layout.left -= (this._padding + this._border)
		layout.top -= (this._padding + this._border)
		layout.height += this._padding * 2 + this._border * 2
		layout.width += this._padding * 2 + this._border * 2 + 20
		
		this._input.layout(layout)
	}
})