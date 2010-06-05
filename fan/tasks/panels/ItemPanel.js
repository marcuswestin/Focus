jsio('from shared.javascript import Class, capitalize')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.tasks.views.TaskItemView')

exports = Class(fan.tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	
	this._createContent = function() {
		supr(this, '_createContent')
		this.position(this._lastLeft, this._lastMaxWidth)
	}
	
	this.position = function(left, availableWidth) {
		this._lastLeft = left
		this._lastMaxWidth = availableWidth
		if (!this._element) { return }
		this._element.style.left = left + 'px'
		if (this._currentView) { this._resize() }
	}
	
	this.setView = function(view) {
		this.appendTo(gBody)
		this._setView(view)
	}
	
	this.viewTask = function(taskItemId) {
		var view = new fan.tasks.views.TaskItemView(taskItemId)
		this.setView(view)
	}
})