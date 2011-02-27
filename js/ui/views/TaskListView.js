var View = require('./View'),
	Button = require('../Button'),
	List = require('../lists/List'),
	TextEditable = require('../TextEditable')

module.exports = Class(View, function(supr) {
	
	this._createHeader = function() {
		new Button('New Task')
			.appendTo(this._header)
			.subscribe('Click', this, '_createTask')
	}
	
	this._createBody = function() {
		new List(function (task) { return new TextEditable(task.title) })
			.reflect(global.user.tasks)
			.appendTo(this._body)
			.setStyle({ width: 300 })
	}

})