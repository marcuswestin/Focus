var View = require('./View'),
	Button = require('../Button'),
	List = require('../lists/List'),
	TextView = require('../TextView')

module.exports = Class(View, function(supr) {
	
	this._createHeader = function() {
		new Button('New Task')
			.appendTo(this._header)
			.subscribe('Click', this, '_createTask')
	}
	
	this._createBody = function() {
		new List(function (task) { return new TextView(task.title) })
			.reflect(global.user.tasks)
			.appendTo(this._body)
			.subscribe('Select', this, function(task) {
				models.local.currentTaskID.set(task._id)
			})
	}
	
	this._createTask = function() {
		var task = new models.Task({ title:"I need to...", owner:global.user })
		global.user.tasks.add(task)
		task.create(function(taskID) {
			models.local.currentTaskID.set(taskID)
		})
	}
})
