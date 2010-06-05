jsio('from shared.javascript import Class')
jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')

exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' TaskItemView'
	this._minWidth = 390
	this._maxWidth = 740
	
	this.init = function(itemId) {
		supr(this, 'init')
		this._itemId = itemId
	}
	
	this.getTaskId = function() { return this._itemId }
	
	this._buildHeader = function() {
		new fan.ui.RadioButtons()
			.addTextButton('Normal', 'normal')
			.addTextButton('Crucial', 'crucial')
			.addTextButton('Backlog', 'backlog')
			.addTextButton('Done', 'done')
			.subscribe('Click', bind(this, '_toggleTaskState'))
			.appendTo(this._header)
	}
	
	this._buildBody = function() {
		gUtil.withTemplate('task', 'panel', bind(this, function(template) {
			this._body.innerHTML = ''
			this._body.appendChild(fin.applyTemplate(template, this._itemId))
		}))
	}
	
	this._toggleTaskState = function(newState) {
		console.log("TOGGLE STATE", newState)
	}
})