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
		this.toggleClassName(this._width == this._minWidth, 'narrow')
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
		
		// Layout panel
		this.layout({ height: this._height, width: this._width, left: this._left })
		// Layout header
		this.layout(this._header, { top: this._padding, left: this._padding,
				height: this._headerHeight, width: contentWidth })
		// Layout content
		this.layout(this._body, { top: this._headerHeight + padding2, left: this._padding, 
				height: contentHeight, width: contentWidth })
	}
	
	this._buildHeader = function() {}
	this._buildBody = function() {}
	this.release = function() { logger.warn("TODO: Implement View#release") }
})