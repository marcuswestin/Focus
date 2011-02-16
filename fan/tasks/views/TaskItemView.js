var RadioButtons = require('../../ui/RadioButtons'),
	BooleanButton = require('../../ui/BooleanButton')
	View = require('./View'),
	Editable = require('../../views/Editable'),
	ItemSetSelect = require('../../views/ItemSetSelect'),
	DatePicker = require('../../views/DatePicker'),
	Discussion = require('../../views/Discussion'),
	keys = require('../../keys')

module.exports = Class(View, function(supr) {
	
	this._className += ' TaskItemView'
	this._minWidth = 390
	this._maxWidth = 740
	this._headerHeight = 0
	
	this.init = function(itemId) {
		supr(this, 'init')
		this._itemId = itemId
	}
	
	this.getTaskId = function() { return this._itemId }
	
	this._buildBody = function() {
		var leftColumn = this._create({ className: 'left-column', parent: this._body }),
			rightColumn = this._create({ className: 'right-column', parent: this._body })
		
		this._titleView = new fan.views.Editable([this._itemId, 'title'])
			.addClassName('title')
			.createLabel('Task')
			.appendTo(leftColumn)
		
		this._statusButtons = new fan.ui.RadioButtons()
			.addButton({ text: 'Normal', payload: null })
			.addButton({ text: 'Urgent', payload: 'urgent' })
			.addButton({ text: 'Backlog', payload: 'backlog' })
			.addButton({ text: 'Done', payload: 'done' })
			.reflect(this._itemId, 'status')
			.createLabel('Status')
			.appendTo(leftColumn)
		
		this._notifyMe = new fan.ui.BooleanButton("Notify me", "Don't bother")
			.reflectSetMembership(this._itemId, fan.keys.subscribers, gUserId)
			.createLabel('When changes are made')
			.appendTo(leftColumn)
		
		this._userSelect = new fan.views.ItemSetSelect([this._itemId, 'type', 'user', 'name'])
			.addClassName('user')
			.createLabel('Owner')
			.appendTo(leftColumn)
		
		this._projectSelect = new fan.views.ItemSetSelect([this._itemId, 'type', 'project', 'title'])
			.addClassName('project')
			.createLabel('Project')
			.appendTo(leftColumn)
		
		this._datePicker = new fan.views.DatePicker([this._itemId, 'date'])
			.addClassName('date')
			.createLabel('Due date')
			.appendTo(leftColumn)
		
		this._descriptionView = new fan.views.Editable([this._itemId, 'description'])
			.addClassName('description')
			.createLabel('Description')
			.appendTo(leftColumn)
		
		this._discussion = new fan.views.Discussion([this._itemId, 'comments'])
			.addClassName('discussion')
			.appendTo(rightColumn)
	}
})