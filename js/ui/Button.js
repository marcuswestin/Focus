jsio('from common.javascript import Class')
jsio('import ui.Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
exports = Class(ui.Component, function(supr) {
	
	this._domTag = 'button'
	this._className = 'Button'
	
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
		this._on('click', bind(this, '_publish', 'Click'))
	}
})