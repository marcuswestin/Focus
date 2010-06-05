jsio('from shared.javascript import Class, forEach')
// jsio('import fan.ui.Button')
// jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')
jsio('import fan.ui.lists.CalendarList')

fin.date = {}

exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' CalendarView'
	
	this._minWidth = 600
	this._maxWidth = 800
	
	this._groups = {
		'Overdue': fin.date.BeforeToday,
		'Today': fin.date.Today,
		'Tomorrow': fin.date.Tomorrow,
		'Even later': fin.date.AfterTomorrow,
		'Unscheduled': fin.date.None
	}
	
	this.init = function() {
		supr(this, 'init')
		this._list = new fan.ui.lists.CalendarList()
			.subscribe('Click', bind(gItemPanel, 'viewTask'))
	}
	
	this._buildHeader = function() {
		forEach(this._groups, bind(this, function(group) {
			this._create({ className: 'groupHeader', text: group, parent: this._header })
		}))
	}
	this._buildBody = function() {
		var myTasksQuery = { done: false, backlog: false, type: 'task', user: gUserId },
			list = this._list,
			groups = this._groups

		forEach(this._groups, bind(list, 'addGroup'))
		fin.query(myTasksQuery, bind(this, '_onTasksChange'))
		list.appendTo(this._body)
	}
	
	this._onTasksChange = function(mutation) {
		if (mutation.op == 'sadd') { this._list.addItems(mutation.args) }
		if (mutation.op == 'srem') { this._list.removeItems(mutation.args) }
	}
})