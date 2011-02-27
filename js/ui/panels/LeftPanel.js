var Panel = require('./Panel'),
	RadioButtons = require('../RadioButtons'),
	TaskListView = require('../views/TaskListView'),
	View = require('../views/View')

module.exports = Class(Panel, function(supr) {
	
	this._className += ' LeftPanel'
	
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
	
	this._createTask = function() {
		var task = new models.Task({ title:"Task", owner:global.user }).create()
		global.user.tasks.add(task)
	}
})

// var Panel = require('./Panel'),
// 	TasksListView = require('../views/TasksListView'),
// 	CalendarView = require('../views/CalendarView'),
// 	NewsView = require('../views/NewsView'),
// 	RadioButtons = require('../../ui/RadioButtons')
// 
// module.exports = Class(Panel, function(supr) {
// 
// 	this._className += ' ListPanel'
// 	
// 	this._viewCtors = {
// 		'tasks': TasksListView,
// 		// 'projects': fan.tasks.views.ProjectsListView,
// 		'calendar': CalendarView,
// 		'news': NewsView,
// 		// 'coworkers': fan.tasks.views.CoworkersView,
// 		// 'accomplishments': fan.tasks.views.AccomplishmentsView
// 	}
// 	
// 	this._createContent = function() {
// 		supr(this, '_createContent')
// 		this._element.style.left = '30px';
// 		
// 		this._views = {}
// 		
// 	}
// 	
// 	this._getButton = function(id) { return { payload: id, className: id } }
// 	
// 	this._onWindowResize = function(winSize) {
// 		supr(this, '_onWindowResize', arguments)
// 		
// 		this._lastMaxWidth = winSize.width
// 		if (!this._currentView) { return }
// 		this._resize()
// 	}
// 	
// })