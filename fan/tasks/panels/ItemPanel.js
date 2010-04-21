jsio('from shared.javascript import Class, capitalize')
jsio('import fan.tasks.panels.Panel')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	this._width = null // dynamic
	this._left = 440
	this._templates = {}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this.hide()
	}
	
	this._onWindowResize = function(winSize) {
		var leftPadding = 10,
			rightPadding = 160
		this._width = winSize.width - this._left - leftPadding - rightPadding
		supr(this, '_onWindowResize', arguments)
	}
	
	this.setItem = function(item) {
		if (this._item) { logger.warn("TODO: release item")}
		this.show()
		this._item = item
		this._item.addDependant('type', bind(this, '_onItemType'))
		this._item.addDependant('title', bind(this, '_updateTitle'))
	}
	
	this._onItemType = function(mutation, type) {
		this._updateTitle()
		gUtil.loadTemplate(type, 'panel', bind(this, function(template) {
			this._content.innerHTML = ''
			this._content.appendChild(fin.applyTemplate(template, this._item.getId()))
		}))
	}
	
	this._updateTitle = function() {
		this._setTitle(capitalize(this._item.getProperty('type')) + ': ' + this._item.getProperty('title'))
	}
	
})