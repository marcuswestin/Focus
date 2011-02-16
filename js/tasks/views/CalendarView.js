var View = require('./View')

var date = {}

module.exports = Class(View, function(supr) {
	
	this._className += ' CalendarView'
	
	this._minWidth = 600
	this._maxWidth = 800
	
	this._groups = {
		'Overdue': date.BeforeToday,
		'Today': date.Today,
		'Tomorrow': date.Tomorrow,
		'Even later': date.AfterTomorrow,
		'Unscheduled': date.None
	}
	
	this.init = function() {
		supr(this, 'init')
		this._list = new fan.ui.lists.CalendarList()
			.subscribe('Click', gItemPanel, 'viewTask')
	}
	
	this._buildHeader = function() {
		forEach(this._groups, bind(this, function(group) {
			this._create({ className: 'groupHeader', text: group, parent: this._header })
		}))
	}
	this._buildBody = function() {
		var myTasksQuery = { type: 'task', status: {op: '!=', value: 'done'}, user: gUserID },
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