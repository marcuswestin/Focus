jsio('from common.javascript import Class, bind')
jsio('import views.Value')
jsio('import ui.textViewEdit')

exports = Class(views.Value, function(supr) {
	
	this._createContent = function() {
		supr(this, '_createContent')
		
		this._on('click', bind(this, '_onClick'))
	}
	
	this._onClick = function() {
		ui.textViewEdit.showAt(this, this._item, this._property)
	}
	
	this.freeze = function() { this._frozen = true }
	this.unfreeze = function() { this._frozen = false }
	
	this.setValue = function(value, force) {
		if (this._frozen && !force) { return }
		if (!value) { value = 'none'; }
		supr(this, 'setValue', arguments)
		this._publish('Resize')
	}
})