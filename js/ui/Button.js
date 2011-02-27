var Component = require('./Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
module.exports = Class(Component, function(supr) {
	
	this._className = 'Button'
	this._text = ''
	
	this._initialize = function(text, iconURL) {
		supr(this, '_initialize')
		this.setText(text)
		this.setIcon(iconURL)
	}
	
	this.setText = function(text) {
		this._text = text || this._text
		if (!this._element) { return this }
		if (!this._label) { this._label = this._create({ parent:this }) }
		this._label.innerHTML = this._text
		return this
	}
	
	this.setIcon = function(iconURL) {
		this._iconURL = iconURL || this._iconURL
		if (!this._element) { return this }
		if (!this._iconURL) { this.remove(this._icon) }
		else if (this._icon) { this._icon.src = iconURL }
		else { this._icon = this._create({ tag:'img', src:this._iconURL, parent:this }) }
		return this
	}
	
	this._createContent = function() {
		this
			.setText()
			.setIcon()
			._makeUnselectable()
			._on('mousedown', bind(this, '_onMouseDown'))
			._on('mouseup', bind(this, '_onMouseUp'))
			._on('mouseout', bind(this, '_onMouseOut'))
			._on('click', bind(this, '_publish', 'Click'))
	}
	
	this._onMouseDown = function() { this.addClassName('down') }
	this._onMouseUp = function() { this.removeClassName('down') }
	this._onMouseOut = function() { this.removeClassName('down') }
})