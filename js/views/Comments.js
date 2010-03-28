jsio('from shared.javascript import Class, bind')
jsio('import views.ListView')
jsio('import ui.Button')
jsio('import ui.Input')

exports = Class(views.ListView, function(supr) {
	
	this._className += ' Comments'
	
	this._createContent = function() {
		this._createHeader()
		supr(this, '_createContent')
		this._values = []
		this._seen = {}
	}
	
	this._createHeader = function() {
		var header = this._create({ parent: this._element, className: 'header' })
		
		this._commentInput = new ui.Input("Comment on it!")
		this._commentInput.appendTo(inputs)
		this._commentInput.addClassName('email')
		this._publish('Create', this._email.getValue(), this._password.getValue())
		
		var sendButton = new ui.Button("Add comment")
		sendButton.appendTo(header)
		sendButton.subscribe('Click', bind(this, '_addComment'))
	}
	
	this._addComment = function() {
		var comment = this._commentInput.getValue()
		this._commentInput.clear()
		
		var newCommentItem = { timestamp: new Date().getTime(), comment: comment, user: gUser.getId() }
		this._getItem().mutate({ property: this._property, append: newCommentItem })
	}
	
	this._onUpdated = function(mutation) { 
		if (mutation.value) {
			// Hmmm - looks like the value passed through is the same array. Can't do appends to that without messing up state from the originating item. Should fix this in the item code
			this._values = Array.prototype.slice.call(mutation.value, 0)
		} else if (mutation.append) {
			if (this._seen[mutation.append.timestamp]) { return } 
			this._seen[mutation.append.timestamp] = true
			this._values.push(mutation.append)
		}
		this.draw()
	}
})