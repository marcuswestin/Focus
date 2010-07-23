jsio('from shared.javascript import Class')
jsio('import fan.ui.resizeManager')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.ui.RadioButtons')
jsio('import fan.ui.Button')

jsio('import fan.tasks.views.TasksListView')
jsio('import fan.tasks.views.ProjectsListView')
jsio('import fan.tasks.views.CalendarView')
jsio('import fan.tasks.views.NewsView')
// jsio('import fan.tasks.views.CoworkersView')
// jsio('import fan.tasks.views.AccomplishmentsView')

exports = Class(fan.tasks.panels.Panel, function(supr) {

	this._className += ' ListPanel'
	
	this._viewCtors = {
		'tasks': fan.tasks.views.TasksListView,
		// 'projects': fan.tasks.views.ProjectsListView,
		'calendar': fan.tasks.views.CalendarView,
		'news': fan.tasks.views.NewsView,
		// 'coworkers': fan.tasks.views.CoworkersView,
		// 'accomplishments': fan.tasks.views.AccomplishmentsView
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._element.style.left = '30px';
		
		this._views = {}
		
		this._apps = new fan.ui.RadioButtons()
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