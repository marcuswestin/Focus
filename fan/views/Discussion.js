jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')
jsio('import fan.ui.lists.List')
jsio('import fan.ui.Button')
jsio('import fan.ui.Component')
jsio('import fan.ui.Input')
jsio('import fan.ui.UserIcon')
jsio('import fan.ui.TimeString')

exports = Class(fan.views.Value, function(supr){
	
	this._createContent = function() {
		this._createMessageBox()
		this._list = new DiscussionList()
		this._list.appendTo(this._element)
		this._subId = fin.observeList(this._itemId, this._property, bind(this, '_onListMutation'))
	}
	
	this._createMessageBox = function() {
		this._input = new fan.ui.Input("Add a comment")
			.appendTo(this._element)
			.subscribe('Submit', bind(this, '_submit'))
		
		new fan.ui.UserIcon(gUserId)
			.appendTo(this._element)
		
		new fan.ui.Button("Comment")
			.appendTo(this._element)
			.subscribe('Click', bind(this, '_submit'))
	}
	
	this._submit = function() {
		var message = this._input.getValue()
		if (!message) { return }
		fin.append(this._itemId, this._property, { message: message, user: gUserId, timestamp: fin.now() })
		this._input.clear()
	}
	
	this._onListMutation = function(operation, items) {
		switch(operation) {
			case 'append':
				this._list.append(items)
				break
			case 'splice':
				this._list.prepend(items)
				break
		}
	}
	
	this._onScroll = function() {
		var maxNumInSight = NaN
		
		fin.extendList(this._itemId, this._property, maxNumInSight)
	}
})

DiscussionList = Class(fan.ui.lists.List, function(supr) {
	
	this._getCellFor = function(item) {
		var message = item.message

		var cell = this._cells[message]
		
		if (cell) { return cell }
		cell = this._createCell(item)
		cell.delegateId = message
		
		return (this._cells[message] = cell)
	}
	
	this._createCell = function(item) {
		var cell = this._create({ className: 'cell' })

		new fan.ui.UserIcon(item.user)
			.appendTo(cell)
		
		var message = this._create({ className: 'message', text: item.message })
		cell.appendChild(message)
		
		new fan.ui.TimeString(item.timestamp)
			.appendTo(cell)
		
		return cell
	}
	
})



