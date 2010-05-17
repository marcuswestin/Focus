jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')
jsio('import fan.ui.lists.List')
jsio('import fan.ui.Button')
jsio('import fan.ui.Component')

exports = Class(fan.views.Value, function(supr){
	
	this._createContent = function() {
		this._createMessageBox()
		this._list = new DiscussionList()
		this._list.appendTo(this._element)
		this._subId = fin.observeList(this._itemId, this._property, bind(this, '_onListMutation'))
	}
	
	this._createMessageBox = function() {
		this._textarea = this._create({ tag: 'textarea', parent: this._element })
		var button = new fan.ui.Button("Comment")
		button.appendTo(this._element)
		button.subscribe('Click', bind(this, '_submit'))
	}
	
	this._submit = function() {
		var message = this._textarea.value
		fin.append(this._itemId, this._property, { message: message })
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
		cell = this._create({ text: message })
		cell.delegateId = message
		
		return (this._cells[message] = cell)
	}
	
})



