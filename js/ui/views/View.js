var Component = require('../../ui/Component')

module.exports = Class(Component, function(supr) {
	
	this._className = 'View'
	this._headerHeight = 40
	this._padding = 2
	this._border = 1

	this._minWidth = 400
	this._maxWidth = 400

	this.setHeight = function(height) {
		this._height = height
		this._resize()
	}
	this.setWidth = function(maxWidth) {
		this._width = maxWidth >= this._maxWidth ? this._maxWidth : this._minWidth
		this.toggleClassName('narrow', this._width == this._minWidth)
		this._resize()
		return this._width
	}
	
	this._createContent = function() {
		this._header = this._create({ className: 'header', parent: this._element })
		this._body = this._create({ className: 'body', parent: this._element })
		if (this._headerHeight) { this._createHeader() }
		else { this.addClassName('noHeader') }
		this._createBody()
		// this._on(this._body, 'scroll', bind(gKeyboardFocus, 'updatePosition', true))
	}
	this._createHeader = function() {}
	this._createBody = function() {}
	
	
	this._resize = function() {
		var border2 = this._border * (this._headerHeight ? 2 : 1),
			vertPadding2 = this._padding * (this._headerHeight ? 2 : 1) + border2,
			contentWidth = this._width - this._padding * 2 - this._border * 2,
			contentHeight = this._height - vertPadding2 - this._headerHeight - border2 * 2,
			top = this._headerHeight ? this._headerHeight + vertPadding2 : this._padding
		
		this.layout({ h: this._height, w: this._width, x: this._left })
		this.layout(this._header, { y: this._padding, x: this._padding, h: this._headerHeight, w: contentWidth })
		this.layout(this._body, { y: top, x: this._padding, h: contentHeight, w: contentWidth })
	}
	
	this.release = function() { log("TODO: Implement View#release") }
	
	this.handleKeyboardFocus = function(el) {
		var body = this._body,
			diffTop = body.scrollTop - el.offsetTop,
			diffBottom = (el.offsetTop + el.offsetHeight) - (body.scrollTop + body.offsetHeight)
		
		if (diffTop > 0) { body.scrollTop -= diffTop }
		if (diffBottom > 0) { body.scrollTop += diffBottom }
	}
})
