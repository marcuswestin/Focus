jsio('from shared.javascript import Class')
jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')
jsio('import fan.tasks.views.ProjectItemView')
jsio('import fan.ui.lists.SortedList')

exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' ProjectsView'
	
	this._buildHeader = function() {
		new fan.ui.RadioButtons()
			.addTextButton('Projects', { done: false, type: 'project' })
			.addTextButton('Completed', { done: true, type: 'project' })
			.subscribe('Click', this, 'loadQuery')
			.appendTo(this._header)
			.select(0)
		
		new fan.ui.Button('New Project')
			.addClassName('createButton')
			.appendTo(this._header)
			.subscribe('Click', gUtil, 'createNewProject', bind(this, '_selectProject'))
	}
	
	this.loadQuery = function(query) {
		if (this._listView) { logger.log("TODO Release view!") }
		this._body.innerHTML = ''
		
		this._listView = new fan.ui.lists.SortedList(bind(this, '_createCell'))
			.query(query)
			.sortBy('title')
			.subscribe('Click', this, '_selectProject')
			.appendTo(this._body)
	}
	
	this._selectProject = function(itemId) {
		var view = new fan.tasks.views.ProjectItemView(itemId)
		gItemPanel.setView(view)
	}
	
	this._createCell = function(item) {
		var itemId = item.getId(),
			cell = this._create({ className: 'cell' }),
			template = '<div class="title">(( Value title ))</div>'
					+ '<div class="date">(( Value date ))</div>'
		
		cell.delegateId = itemId
		cell.appendChild(fin.applyTemplate(template, itemId))
		return cell
	}
})