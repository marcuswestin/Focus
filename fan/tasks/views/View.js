jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')
jsio('import fan.ui.resizeManager')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'View'
	this._headerHeight = 40
	this._padding = 2
	this._border = 1

	this._minWidth = 300
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
		this._buildHeader()
		this._buildBody()
	}
	
	this._resize = function() {
		var padding2 = this._padding * 2 + this._border * 2,
			contentWidth = this._width - padding2,
			contentHeight = this._height - padding2 - this._headerHeight - this._border * 4
		
		this.layout({ h: this._height, w: this._width, x: this._left })
		this.layout(this._header, { y: this._padding, x: this._padding, h: this._headerHeight, w: contentWidth })
		this.layout(this._body, { y: this._headerHeight + padding2, x: this._padding, h: contentHeight, w: contentWidth })
	}
	
	this._buildHeader = function() {}
	this._buildBody = function() {}
	this.release = function() { logger.warn("TODO: Implement View#release") }
})