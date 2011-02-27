var Component = require('../Component'),
	Panel = require('./Panel'),
	RadioButtons = require('../RadioButtons'),
	TasksListView = require('../views/TasksListView'),
	TasksCalendarView = require('../views/TasksCalendarView'),
	View = require('../views/View')

module.exports = Class(Panel, function(supr) {
	
	this._className += ' LeftPanel'
	
	this._createContent = function() {
		new RadioButtons()
			.appendTo(this)
			.addClassName('ViewsToggle')
			.addButton(buttonInfo('tasks', TasksListView))
			.addButton(buttonInfo('calendar', TasksCalendarView))
			.addButton(buttonInfo('news', View))
			.addButton(buttonInfo('coworkers', View))
			.addButton(buttonInfo('achievements', View))
			.subscribe('Click', this, '_selectView')
			.select(0)
		
		function buttonInfo(name, Constructor) {
			return { icon:'img/apps/'+name+'.png', name:name, Constructor:Constructor }
		}
	}
	
	this._selectView = function(payload) {
		var name = payload.name,
			views = this._views
		if (!views[name]) { views[name] = new payload.Constructor() }
		this._setView(views[name])
	}
})
