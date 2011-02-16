var Component = require('./Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
module.exports = Class(Component, function(supr) {
	
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