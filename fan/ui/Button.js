jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'Button fan-unselectable'
	
	this.init = function(text) {
		supr(this, 'init')
		this.setText(text)
	}
	
	this.setText = function(text) {
		this._text = text || this._text
		if (this._element) { this._element.innerHTML = this._text }
	}
	
	this._createContent = function() {
		this.setText()
		this._on('mousedown', bind(this, '_onMouseDown'))
		this._on('mouseup', bind(this, '_onMouseUp'))
		this._on('mouseout', bind(this, '_onMouseOut'))
		this._on('click', bind(this, '_publish', 'Click'))
	}
	
	this._onMouseDown = function() { this.addClassName('down') }
	this._onMouseUp = function() { this.removeClassName('down') }
	this._onMouseOut = function() { this.removeClassName('down') }
})