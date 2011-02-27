var Panel = require('./Panel'),
	RadioButtons = require('../RadioButtons'),
	TaskListView = require('../views/TaskListView'),
	View = require('../views/View')

module.exports = Class(Panel, function(supr) {
	
	this._className += ' LeftPanel'
	
	this.resize = function(availableWidth, height) {
		return supr(this, 'resize', [availableWidth, height - this._headerHeight])
	}
	
	this._createContent = function() {
		new RadioButtons()
			.appendTo(this)
			.addClassName('ViewsToggle')
			.addButton(buttonInfo('tasks', TaskListView))
			.addButton(buttonInfo('calendar', View))
			.addButton(buttonInfo('achievements', View))
			.addButton(buttonInfo('coworkers', View))
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
