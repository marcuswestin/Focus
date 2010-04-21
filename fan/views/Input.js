jsio('from shared.javascript import Class, bind')
jsio('import client.caret')
jsio('import fan.views.Value')

exports = Class(fan.views.Value, function(supr){
	
	this._domTag = 'textarea'
	this.className += ' Input'
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('focus', bind(this, '_onFocus'))
		this._on('keypress', bind(this, '_onKeyPress'))
		this._on('blur', bind(this, '_onBlur'))
		
		// this._property = this._propertyChain.pop()
		// this._chainedItem = this._item.getChainedItem(this._propertyChain)
	}
	
	this.focus = function() { this._element.focus() }
	
	this._onFocus = function(e) { 
		// this._getItem().requestFocus(bind(this, function(){
		// 	this._element.blur()
		// 	this._onBlur()
		// }))
		this._focused = true
		if (this._element.value == this._property) { this._element.value = '' }
	}
	
	this._onBlur = function() {
		this._focused = false 
		if (this._element.value == '') { this._element.value = this._property }
		this._publish('Blur')
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		if (this._focused) { return }
		this._element.disabled = false
		this._element.value = typeof value == 'string' ? value : this._property
		if (typeof newValue == 'undefined') { return }
		this._onBlur()
	}
	this.clear = function() { this.setValue('') }
		
	this._onKeyPress = function(e) {
		// TODO: Deal with pasting
		if (e.metaKey && e.keyCode != this.keys['enter']) { return }
		
		// var position = client.caret.getPosition(this._element)
		// var selectionLength = position.end - position.start
		// var mutation = { position: position.caret - selectionLength }
		// 
		// var shiftIsDown = false // we need to know if the shift key is down to enable adding breaklines :(
		// if (e.keyCode == this.keys['enter'] && !shiftIsDown) {
		// 	this._element.blur()
		// 	e.cancel()
		// 	return
		// } else if (e.keyCode == this.keys['backspace']) {
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
			fin.mutate(this._itemId, 'set', this._property, this._element.value)
			this._publish('NewValue', this._element.value) 
		}))
	}
	
	this._getItem = function() {
		return this._item.getChainedItem(this._propertyChain)
	}
})