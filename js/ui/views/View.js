var Component = require('../../ui/Component')

module.exports = Class(Component, function(supr) {
	
	this._className = 'View'
	this._headerHeight = 40
	this._padding = 2
	this._border = 1
	this._width = 400
	
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
	
	this.resize = function(availableWidth, height) {
		var vertBorder2 = this._border * (this._headerHeight ? 2 : 1),
			vertPadding2 = this._padding * (this._headerHeight ? 2 : 1) + vertBorder2,
			contentWidth = this._width - this._padding * 2 - this._border * 2,
			contentHeight = height - vertPadding2 - this._headerHeight - vertBorder2 * 2,
			top = this._headerHeight ? this._headerHeight + vertPadding2 : this._padding
		
		this.layout({ h: height, w: this._width, x: this._left })
		this.layout(this._header, { y: this._padding, x: this._padding, h: this._headerHeight, w: contentWidth })
		this.layout(this._body, { y: top, x: this._padding, h: contentHeight, w: contentWidth })
		
		return contentWidth + this._border*2 + this._padding*2
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
