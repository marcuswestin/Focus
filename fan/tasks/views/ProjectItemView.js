jsio('from shared.javascript import Class')

jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.ui.lists.SortedList')

jsio('import fan.tasks.views.View')
jsio('import fan.tasks.views.TaskItemView')

exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' ProjectItemView'
	this._minWidth = 350
	this._maxWidth = 350
	
	this.init = function(itemId) {
		supr(this, 'init')
		this._itemId = itemId
	}
	
	this._buildHeader = function() {
		new fan.ui.Button('New Task')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', bind(gUtil, 'createNewTask', {project: this._itemId}, function(){}))
	}
	
	this._buildBody = function() {
		var body = this._body,
			template = '<div class="title">Project - (( Editable title ))</div>'
				+ '<div class="status">Completed(( Checkbox done ))</div>'
		
		body.innerHTML = ''
		body.appendChild(fin.applyTemplate(template, this._itemId))

		var query = { type: 'task', done: false, project: this._itemId }
		new fan.ui.lists.SortedList(bind(this, '_createCell'), query, 'crucial')
			.subscribe('Click', bind(this, '_selectProject'))
			.appendTo(body)
	}
	
	this._createCell = function(item) {
		var itemId = item.getId(),
			cell = this._create({ className: 'cell' })
		
		cell.delegateId = itemId
		gUtil.withTemplate('task', 'list', bind(this, '_applyTemplate', cell, itemId))
		return cell
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
	
	this._selectProject = function(itemId, cell) {
		var view = new fan.tasks.views.TaskItemView(itemId)
		gItemPanel.setView(view)
	}
})