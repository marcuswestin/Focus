jsio('from common.javascript import Class, bind')
jsio('import views.Value')
jsio('import ui.textViewEdit')

exports = Class(views.Value, function(supr) {
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(ui.textViewEdit, 'showAt', this, this._item, this._property))
	}
	
	this._setValue = function(value) {
		if (!value) { value = 'none' }
		supr(this, '_setValue', arguments)
	}
})