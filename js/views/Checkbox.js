jsio('from shared.javascript import Class, bind')
jsio('import views.Value')

exports = Class(views.Value, function(supr){
	
	this._domTag = 'input'
	this._domType = 'checkbox'
	this._className += ' Checkbox'
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._on('change', bind(this, '_checkValue'))
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		this._element.checked = Boolean(value)
	}

	this.createDelayedMethod('_checkValue', function() {
		var isChecked = this._element.checked,
			shouldBeChecked = Boolean(this._item.getProperty(this._property))
		
		if (isChecked != shouldBeChecked) {
			this._item.mutate({ property: this._property, value: isChecked })
		}
	})
})