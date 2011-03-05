var View = require('./View'),
	Button = require('../Button'),
	RadioButtons = require('../RadioButtons'),
	List = require('../lists/List'),
	TextView = require('../TextView')

module.exports = Class(View, function(supr) {
	
	this._createHeader = function() {
		new RadioButtons()
			.addClassName('orderToggle')
			.addButton({ text:'by date' })
			.addButton({ text:'by project' })
			.subscribe('Select', this, '_selectOrder')
			.appendTo(this._header)
			.select(0)
		
		new Button('New Task')
			.addClassName('createTaskButton')
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
	
	this._selectOrder = function(order) {
		console.log('_selectOrder', order)
	}
	
	this._createTask = function() {
		var task = new models.Task({ title:"I need to...", owner:global.user })
		global.user.tasks.add(task)
		task.create(function(taskID) {
			models.local.currentTaskID.set(taskID)
		})
	}
})
