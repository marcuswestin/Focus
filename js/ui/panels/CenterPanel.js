var Panel = require('./Panel')

module.exports = Class(Panel, function(supr) {
	
})

// var Panel = require('./Panel'),
// 	query = require('../../query'),
// 	TaskItemView = require('../views/TaskItemView')
// 
// module.exports = Class(Panel, function(supr) {
// 	
// 	this._className += ' ItemPanel'
// 	
// 	this._createContent = function() {
// 		supr(this, '_createContent')
// 		this.position(this._lastLeft, this._lastMaxWidth)
// 		query.subscribe('HashChanged', this, '_onHashChanged')
// 	}
// 	
// 	this._onHashChanged = function(newItemId) {
// 		this.viewTask(newItemId)
// 	}
// 	
// 	this.position = function(left, availableWidth) {
// 		this._lastLeft = left
// 		this._lastMaxWidth = availableWidth
// 		if (!this._element) { return }
// 		this._element.style.left = left + 'px'
// 		if (this._currentView) { this._resize() }
// 	}
// 	
// 	this.setView = function(view) {
// 		this.appendTo(gBody)
// 		this._setView(view)
// 	}
// 	
// 	this.viewTask = function(taskItemId) {
// 		if (taskItemId.getId) { taskItemId = taskItemId.getId() }
// 		var currentView = this._currentView,
// 			currentTaskId = currentView && currentView.getTaskId && currentView.getTaskId()
// 		
// 		if (currentTaskId == taskItemId) { return }
// 		var view = new TaskItemView(taskItemId)
// 		this.setView(view)
// 		query.setHash(taskItemId)
// 	}
// })