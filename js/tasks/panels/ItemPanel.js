jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	this._width = null // dynamic
	this._left = 420
	this._templates = {}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this.hide()
	}
	
	this._onWindowResize = function(winSize) {
		var leftPadding = 10,
			rightPadding = 250
		this._width = winSize.width - this._left - leftPadding - rightPadding
		supr(this, '_onWindowResize', arguments)
	}
	
	this.setItem = function(item) {
		if (this._item) { logger.warn("TODO: release item")}
		this.show()
		this._item = item
		this._item.addDependant('type', bind(this, '_onItemType'))
	}
	
	this._onItemType = function(mutation, type) {
		gUtil.loadTemplate(type, bind(this, function(template) {
			this._content.innerHTML = ''
			this._content.appendChild(fin.applyTemplate(template, this._item.getId()))
		}))
	}
})