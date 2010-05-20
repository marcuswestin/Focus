jsio('from shared.javascript import Class, capitalize')
jsio('import fan.tasks.panels.Panel')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	this._width = null // dynamic
	this._left = 470
	this._templates = {}
	this._wideWidth = 750
	this._narrowWidth = 370
	
	this._createContent = function() {
		supr(this, '_createContent')
		this.hide()
	}
	
	this._onWindowResize = function(winSize) {
		var leftPadding = 10,
			rightPadding = 10,
			availableWith = winSize.width - this._left - leftPadding - rightPadding,
			shouldBeNarrow = (availableWith < this._wideWidth)

		this._width = shouldBeNarrow ? this._narrowWidth : this._wideWidth
		supr(this, '_onWindowResize', arguments)
	}
	
	this.setItem = function(itemId) {
		if (this._typeSub) { fin.release(this._typeSub) }
		if (this._titleSub) { fin.release(this._titleSub) }
		
		this._itemId = itemId
		this.show()

		this._typeSub = fin.observe(this._itemId, 'type', bind(this, '_onItemType'))
		this._titleSub = fin.observe(this._itemId, 'title', bind(this, '_onTitle'))
	}
	
	this._onItemType = function(mutation, type) {
		this._itemType = type
		this._updateTitle()
		gUtil.loadTemplate(type, 'panel', bind(this, function(template) {
			this._content.innerHTML = ''
			this._content.appendChild(fin.applyTemplate(template, this._itemId))
		}))
	}
	
	this._onTitle = function(mutation, title) {
		this._itemTitle = title
		this._updateTitle()
	}
	
	this._updateTitle = function() {
		this._setTitle(capitalize(this._itemType) + ': ' + this._itemTitle)
	}
	
})