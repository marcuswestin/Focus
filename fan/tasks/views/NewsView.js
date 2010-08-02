jsio('from shared.javascript import Class')
jsio('import fan.ui.Button')
jsio('import fan.ui.RadioButtons')
jsio('import fan.tasks.views.View')
jsio('import fan.ui.lists.List')
jsio('import fan.ui.Component')
jsio('import fan.ui.UserIcon')


jsio('import fan.keys')
jsio('import fan.time')


exports = Class(fan.tasks.views.View, function(supr) {
	
	this._className += ' NewsView'
	
	this._buildHeader = function() {
		// new fan.ui.RadioButtons()
		// 	.addButton({ text: 'Tasks', payload: { status: {op:'!=', value:'done'}, type: 'task', user: gUserId } })
		// 	// .addButton({ text: 'Today' })
		// 	// .addButton({ text: 'Crucial' })
		// 	.addButton({ text: 'Backlog', payload: { status: 'backlog', type: 'task', user: gUserId } })
		// 	.addButton({ text: 'Done', payload: { status: 'done', type: 'task', user: gUserId } })
		// 	.subscribe('Click', this, 'loadQuery')
		// 	.appendTo(this._header)
		// 	.select(0)
		// 
		// new fan.ui.Button('New task')
		// 	.addClassName('createButton')
		// 	.appendTo(this._header)
		// 	.subscribe('Click', fan.util, 'createNewTask', {}, bind(gItemPanel, 'viewTask'))
	}
	
	this._buildBody = function() {
		this._listView = new fan.ui.lists.List(bind(this, '_getCellFor'))
			.reflectList(gUserId, fan.keys.notifications, true)
			.addClassName('NewList')
			.subscribe('Click', this, '_onNewsClick')
			.appendTo(this._body)
	}
	
	this._onNewsClick = function(notification) {
		gItemPanel.viewTask(notification.id)
	}
	
	this._getCellFor = function(notification) {
		var cell = this._create({ className: 'cell' })

		new fan.ui.UserIcon(notification.user)
			.appendTo(cell)
		
		new fan.time.TimeString(notification.time)
			.appendTo(cell)

		new fan.ui.Component('span')
			.reflect(notification.user, 'name', { pre: ' ' })
			.appendTo(cell)
		
		this._create({ tag: 'span', text: ' changed the ' + notification.property + ' of ', parent: cell })
		
		new fan.ui.Component('span')
			.addClassName('title')
			.reflect(notification.id, 'title', { pre: '&quot;', post: '&quot;' })
			.appendTo(cell)
		
		this._create({ tag: 'br', parent: cell })
		
		return cell
	}
	
	this._applyTemplate = function(cell, itemId, template) {
		cell.appendChild(fin.applyTemplate(template, itemId))
	}
})


