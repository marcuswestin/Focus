var View = require('./View'),
	TextEditable = require('../TextEditable')

module.exports = Class(View, function(supr) {
	
	this._headerHeight = 0
	
	this.init = function(task) {
		supr(this, 'init')
		this._task = task
	}
	
	this._createBody = function() {
		new TextEditable(this._task.title)
			.createLabel("title")
			.appendTo(this._body)
		
		new TextEditable(this._task.description)
			.createLabel("description")
			.appendTo(this._body)
	}
})
