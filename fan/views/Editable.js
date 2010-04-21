jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')
jsio('import fan.ui.textViewEdit')

exports = Class(fan.views.Value, function(supr) {
	
	this._className += ' Editable'
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(this, '_onClick'))
	}
	
	this._onClick = function() {
		fan.ui.textViewEdit.showAt(this, this._item, this._property)
	}
	
	this.setValue = function(value) {
		if (!value) { value = 'none'; }
		supr(this, 'setValue', arguments)
		this._publish('Resize')
	}
})