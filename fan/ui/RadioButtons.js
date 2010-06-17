jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'RadioButtons'
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_onDelegateClick'))
		this._payloads = {}
		this._buttons = []
	}
	
	this.addButton = function(props) {
		var el = this._create({ className: 'Button ' + props.className, text: props.text, parent: this.getElement() }),
			delegateId = fin.unique(),
			buttons = this._buttons
		
		this._payloads[delegateId] = props.payload
		el.delegateId = delegateId
		buttons.push(el)
		buttons[delegateId] = el
		
		if (!this._leftButton) {
			this._leftButton = el
			this.addClassName(el, 'left')
		}
		if (this._rightButton) {
			this.removeClassName(this._rightButton, 'right')
		}
		this._rightButton = el
		this.addClassName(el, 'right')

		return el
	}
	
	this._onDelegateClick = function(delegateId) {
		var currSelected = this._selected,
			newSelected = this._buttons[delegateId]
		
		if (currSelected) { this.removeClassName(currSelected, 'down') }
		this.addClassName(newSelected, 'down')
		this._selected = newSelected
		
		this._publish('Click', this._payloads[delegateId])
	}
})