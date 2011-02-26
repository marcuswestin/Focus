var TextView = require('./TextView'),
	Component = require('./Component'),
	TextInput = require('./TextInput')
	
module.exports = Class(TextView, function(supr) {
	
	this._className += ' TextEditable'
	this._padding = 4
	this._border = 2
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(this, '_onClick'))
		this._on('mouseover', bind(this, 'addClassName', 'hot'))
		this._on('mouseout', bind(this, 'removeClassName', 'hot'))
	}
	
	this._onClick = function() {
		this._input = new TextInput(this._property)
			.appendTo(document.body)
			.subscribe('Blur', this, '_onBlur')
			.setStyle({ position:'absolute', overflow:'hidden', padding:this._padding,
			 	paddingRight:0, // so that the text inside the input box doesn't wrap around by hitting the end of the input box
				fontSize: this.getStyle('font-size'), fontFamily: this.getStyle('font-family'),
				fontWeight: this.getStyle('font-weight'), lineHeight: this.getStyle('line-height') })
		
		this._resizeInput()
		
		this._input.focus()
	}
	
	this._onBlur = function() {
		this._input.release().remove()
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
	}
})