var Class = require('../Class'),
	ValueView = require('./Value')

module.exports = Class(ValueView, function(supr){
	
	this._createContent = function() {
		this._createMessageBox()
		this._list = new fan.ui.lists.List(bind(this, '_createCell'))
		this._list.appendTo(this._element)
		this._subId = fin.observeList(this._itemId, this._property, bind(this, '_onListMutation'))
	}
	
	this._createCell = function(item) {
		var cell = this._create({ className: 'cell' })
		
		new fan.ui.UserIcon(item.user).appendTo(cell)
		this._create({ className: 'message', text: item.message, parent: cell })
		new fan.time.TimeString(item.timestamp).appendTo(cell)
		
		return cell
	}
	
	this._createMessageBox = function() {
		var messageBox = this._create({ className: 'commentBox', parent: this._element })
		
		this._input = new fan.ui.Input("Add a comment")
			.appendTo(messageBox)
			.subscribe('Submit', this, '_submit')
		
		new fan.ui.UserIcon(gUserID)
			.appendTo(messageBox)
		
		new fan.ui.Button("Comment")
			.appendTo(messageBox)
			.subscribe('Click', this, '_submit')
		
		this._makeFocusable(this._input.getElement())
	}
	
	this.handleKeyboardSelect = function() {
		this._input.focus()
	}
	
	this._submit = function() {
		var message = this._input.getValue()
		if (!message) { return }
		fin.prependToList(this._itemId, this._property, { message: message, user: gUserID, timestamp: fin.now() })
		this._input.clear()
	}
	
	this._onListMutation = function(mutation) {
		var items = mutation.args
		switch(mutation.op) {
			case 'push':
				this._list.append(items)
				break
			case 'unshift':
				this._list.prepend(items)
				break
		}
	}
	
	this._onScroll = function() {
		var maxNumInSight = NaN
		
		fin.extendList(this._itemId, this._property, maxNumInSight)
	}
})
