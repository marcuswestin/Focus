var Panel = require('./Panel'),
	RadioButtons = require('../RadioButtons'),
	_viewConstructors = {
		"list": require('../views/TaskListView'),
		"calendar": require('../views/View')
	}

module.exports = Class(Panel, function(supr) {
	
	this._createContent = function() {
		this._apps = new RadioButtons()
			.addButton('list')
			.addButton('calendar')
			// .addButton(this._getButton('projects'))
			// .addButton(this._getButton('news'))
			// .addButton(this._getButton('coworkers'))
			// .addButton(this._getButton('accomplishments'))
			.appendTo(this)
			.subscribe('Click', this, '_selectView')
			.select(0)
	}
	
	this._selectView = function(name) {
		var views = this._views
		if (!views[name]) { views[name] = new _viewConstructors[name]() }
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