jsio('from shared.javascript import Class, capitalize')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.tasks.views.TaskView')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	
	this._createContent = function() {
		supr(this, '_createContent')
		this.position(this._lastLeft, this._lastWidth)
	}
	
	this.position = function(left, availableWidth) {
		this._lastLeft = left
		this._lastWidth = availableWidth
		if (!this._element) { return }
		this._element.style.left = left + 'px'
		if (this._currentView) { this._currentView.setWidth(availableWidth) }
	}
	
	this.setItem = function(itemId) {
		this.appendTo(gBody)
		this._setView(new fan.tasks.views.TaskView(itemId))
	}
})