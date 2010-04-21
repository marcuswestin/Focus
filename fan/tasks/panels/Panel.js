jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')
jsio('import fan.ui.resizeManager')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'Panel'
	this._width = null // override
	this._left = null // override
	this._headerHeight = 22
	this._padding = 2
	this._border = 1
	
	this._createContent = function() {
		this._header = this._create({ parent: this._element, className: 'header' })
		this._content = this._create({ parent: this._element, className: 'content' })
		fan.ui.resizeManager.addDependant(bind(this, '_onWindowResize'))
	}
	
	this._onWindowResize = function(winSize) {
		var padding2 = this._padding * 2 + this._border * 2,
			height = winSize.height - 100,
			contentWidth = this._width - padding2,
			contentHeight = height - padding2 - this._headerHeight - this._border * 4
		
		// Layout panel
		this.layout({ height: height, width: this._width, left: this._left })
		// Layout header
		this.layout(this._header, { top: this._padding, left: this._padding,
				height: this._headerHeight, width: contentWidth })
		// Layout content
		this.layout(this._content, { top: this._headerHeight + padding2, left: this._padding, 
				height: contentHeight, width: contentWidth })
	}
	
	this._setTitle = function(title) {
		this._header.innerHTML = '<div class="title">' + title + '</div>'
	}
})