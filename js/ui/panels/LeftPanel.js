var Component = require('../Component'),
	Panel = require('./Panel'),
	RadioButtons = require('../RadioButtons'),
	TasksListView = require('../views/TasksListView'),
	View = require('../views/View')

module.exports = Class(Panel, function(supr) {
	
	this._className += ' LeftPanel'
	
	this._createContent = function() {
		this._view = new TasksListView().appendTo(this)
	}
})
