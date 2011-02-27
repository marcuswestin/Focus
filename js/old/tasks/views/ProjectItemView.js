jsio('from shared.javascript import Class')

jsio('import fan.util')

jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.ui.lists.SortedList')

jsio('import fan.tasks.views.View')

module.exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' ProjectItemView'
	this._minWidth = 350
	this._maxWidth = 350
	
	this._initialize = function(itemId) {
		supr(this, '_initialize')
		this._itemId = itemId
	}
	
	this._buildHeader = function() {
		new fan.ui.Button('New Task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', fan.util, 'createNewTask', { project: this._itemId }, function(){})
	}
	
	this._buildBody = function() {
		var body = this._body,
			template = '<div class="title">Project - (( Editable title ))</div>'
		
		body.innerHTML = ''
		body.appendChild(fin.applyTemplate(template, this._itemId))

		var query = { type: 'task', status: null, project: this._itemId }
		new fan.ui.lists.SortedList(bind(this, '_createCell'))
			.reflectSortedSet(query)
			// TODO .sortBy('priority')
			.subscribe('Click', gItemPanel, 'viewTask')
			.appendTo(body)
	}
	
	this._createCell = function(item) {
		var itemId = item.getId(),
			cell = this._create({ className: 'cell' })
		
		cell.delegateId = itemId
		// fan.util.withTemplate('task-list', bind(this, '_applyTemplate', cell, itemId))
		return cell
	}
})