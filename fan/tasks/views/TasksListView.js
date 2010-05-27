jsio('from shared.javascript import Class')
jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')

exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' TasksListView'
	
	this._buildHeader = function() {
		new fan.ui.RadioButtons()
			.addTextButton('Tasks', { done: false, backlog: false, type: 'task', user: gUserId, })
			.addTextButton('Backlog', { done: false, backlog: true, type: 'task', user: gUserId })
			.addTextButton('Done', { done: true, type: 'task', user: gUserId })
			.subscribe('Click', bind(this, 'loadQuery'))
			.appendTo(this._header)
			.select(0)
		
		var newItemProps = { type: 'task', user: gUserId, done: false }
		new fan.ui.Button('New task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', bind(fin, 'create', newItemProps, bind(gItemPanel, 'setItem')))
	}
	
	this.loadQuery = function(query) {
		if (this._listView) { logger.log("TODO Release view!") }
		this._body.innerHTML = ''
		this._listView = fin.createView('SortedList', query, 'critical')
			.subscribe('Click', bind(gItemPanel, 'setItem'))
			.appendTo(this._body)
	}
})