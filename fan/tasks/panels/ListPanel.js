var Panel = require('./Panel'),
	TasksListView = require('../views/TasksListView'),
	CalendarView = require('../views/CalendarView'),
	NewsView = require('../views/NewsView'),
	RadioButtons = require('../../ui/RadioButtons')

module.exports = Class(Panel, function(supr) {

	this._className += ' ListPanel'
	
	this._viewCtors = {
		'tasks': TasksListView,
		// 'projects': fan.tasks.views.ProjectsListView,
		'calendar': CalendarView,
		'news': NewsView,
		// 'coworkers': fan.tasks.views.CoworkersView,
		// 'accomplishments': fan.tasks.views.AccomplishmentsView
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._element.style.left = '30px';
		
		this._views = {}
		
		this._apps = new RadioButtons()
			.addButton(this._getButton('tasks'))
			.addButton(this._getButton('calendar'))
			// .addButton(this._getButton('projects'))
			.addButton(this._getButton('news'))
			// .addButton(this._getButton('coworkers'))
			// .addButton(this._getButton('accomplishments'))
			.addClassName('AppsTabs')
			.appendTo(this._element)
			.subscribe('Click', this, 'selectApp')
			.select(0)
	}
	
	this._getButton = function(id) { return { payload: id, className: id } }
	
	this._onWindowResize = function(winSize) {
		supr(this, '_onWindowResize', arguments)
		
		this._lastMaxWidth = winSize.width
		if (!this._currentView) { return }
		this._resize()
	}
	
	this.selectApp = function(appName) {
		var views = this._views
		if (!views[appName]) { views[appName] = new this._viewCtors[appName]() }
		this._setView(views[appName])
	}
})