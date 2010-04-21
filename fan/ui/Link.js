jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'Link'
	
	this.init = function(text) {
		supr(this, 'init')
		this._text = text
	}
	
	this._createContent = function() {
		this._element.innerHTML = this._text
		this._on('click', bind(this, '_publish', 'Click'))
	}
})