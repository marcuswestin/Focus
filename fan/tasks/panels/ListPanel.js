jsio('from shared.javascript import Class')
jsio('import fan.ui.resizeManager')
jsio('import fan.tasks.panels.Panel')
jsio('import fan.ui.RadioButtons')
jsio('import fan.ui.Button')

jsio('import fan.tasks.views.TasksListView')
// jsio('import fan.tasks.views.CalendarView')
// jsio('import fan.tasks.views.ChangesView')
// jsio('import fan.tasks.views.CoworkersView')
// jsio('import fan.tasks.views.AccomplishmentsView')

exports = Class(fan.tasks.panels.Panel, function(supr) {

	this._className += ' ListPanel'
	
	this._viewCtors = {
		'tasks': fan.tasks.views.TasksListView,
		'calendar': fan.tasks.views.CalendarView,
		'changes': fan.tasks.views.ChangesView,
		'coworkers': fan.tasks.views.CoworkersView,
		'accomplishments': fan.tasks.views.AccomplishmentsView
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._element.style.left = '30px';
		
		this._views = {}
		
		new fan.ui.RadioButtons()
			.addButton('tasks', 'tasks')
			// .addButton('calendar', 'calendar')
			// .addButton('changes', 'changes')
			// .addButton('coworkers', 'coworkers')
			// .addButton('accomplishments', 'accomplishments')
			.addClassName('AppsTabs')
			.appendTo(this._element)
			.subscribe('Click', bind(this, 'selectApp'))
			.select(0)
	}
	
	this._onWindowResize = function(winSize) {
		supr(this, '_onWindowResize', arguments)
		
		this._lastMaxWidth = winSize.width
		if (!this._currentView) { return }
		this._resize()
	}
	
	this.selectApp = function(appName) {
		if (!this._views[appName]) { this._views[appName] = new this._viewCtors[appName]() }
		this._setView(this._views[appName])
	}
})