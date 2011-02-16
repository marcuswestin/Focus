var Class = require('../Class'),
	ValueView = require('./Value')

module.exports = Class(ValueView, function(supr){
	
	this._domTag = 'textarea'
	this.className += ' Input'
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('focus', bind(this, '_onFocus'))
		this._on('blur', bind(this, '_onBlur'))
		this._on('keypress', bind(this, '_onKeyPress'))
	}
	
	this.focus = function() { 
		if (this._focused) { return }
		this._element.focus()
	}
	
	this.blur = function() { 
		if (!this._focused) { return }
		this._element.blur()
	}
	
	this._onFocus = function(e) { 
		gKeyboardFocus.grabFocus(this)
		this._focused = true
		if (this._element.value == this._property) { this._element.value = '' }
	}
	
	this._onBlur = function() {
		gKeyboardFocus.releaseFocus(this)
		this._focused = false 
		if (this._element.value == '') { this._element.value = this._property }
		this._publish('Blur')
	}
	
	this._onKeyPress = function(e) {
		// TODO: Deal with pasting
		if (e.metaKey && e.keyCode != this.keys['enter']) { return }
		
		// var position = client.caret.getPosition(this._element)
		// var selectionLength = position.end - position.start
		// var mutation = { position: position.caret - selectionLength }
		
		if (e.keyCode == this.keys['escape'] || (e.keyCode == this.keys['enter'] && !gKeyboardFocus.shiftIsDown())) {
			this._element.blur()
			e.cancel()
			return
		} // else if (e.keyCode == this.keys['backspace']) {
		// 	if (selectionLength) {
		// 		mutation.deletion = selectionLength
		// 	} else {
		// 		mutation.position -= 1
		// 		mutation.deletion = 1
		// 	}
		// } else if (e.keyCode == this.keys['enter']) {
		// 	mutation.addition = "\n"
		// 	if (selectionLength) {
		// 		mutation.deletion = selectionLength
		// 	}
		// } else if (e.charCode) {
		// 	mutation.addition = String.fromCharCode(e.charCode)
		// 	if (selectionLength) {
		// 		mutation.deletion = selectionLength
		// 	}
		// }
		
		// Don't publish no op mutations
		// if (!mutation.deletion && !mutation.addition) { return }
		
		setTimeout(bind(this, function(){ 
			if (this._value == this._element.value) { return }
			fin.set(this._itemId, this._property, this._element.value)
		}))
	}
	
	this.setValue = function(value) {
		this._value = value
		this._element.value = value
	}
})