var Component = require('./Component')

module.exports = Class(Component, function(supr) {
	
	this._className = 'RadioButtons'
	
	this._createContent = function() {
		this._delegateOn('click', bind(this, '_onDelegateClick'))
		this._payloads = {}
		// this._payloadIndex = {}
		this._buttons = []
	}
	
	this.addButton = function(props) {
		var className = 'Button ' + (props.className ? ' ' + props.className : '')
			el = this._create({ className:className, parent:this }),
			delegateID = unique(),
			buttons = this._buttons
		
		if (props.icon) { this._create({ tag:'img', src:props.icon, parent:el }) }
		if (props.text) { this._create({ text:props.text, parent:el }) }
		
		this._makeUnselectable(el)
		this._payloads[delegateID] = props
		// this._payloadIndex[props.payload] = buttons.length
		el.delegateID = delegateID
		buttons.push(el)
		buttons[delegateID] = el
		
		if (!this._leftButton) {
			this._leftButton = el
			this.addClassName(el, 'left')
		}
		if (this._rightButton) {
			this.removeClassName(this._rightButton, 'right')
		}
		this._rightButton = el
		this.addClassName(el, 'right')
		
		return this
	}
	
	this.select = function(index, silent) {
		this._onDelegateClick(this._buttons[index].delegateID, null, silent)
		return this
	}
	
	this.reflect = function(itemId, property) {
		fin.observe(itemId, property, bind(this, function(mutation, value) {
			this.select(this._payloadIndex[value], true)
		}))
		this.subscribe('Click', this, function(value) {
			fin.set(itemId, property, value)
		})
		return this
	}
	
	this._onDelegateClick = function(delegateID, e, silent) {
		var currSelected = this._selected,
			newSelected = this._buttons[delegateID]
		
		if (currSelected) { this.removeClassName(currSelected, 'down') }
		this.addClassName(newSelected, 'down')
		this._selected = newSelected
		
		if (!silent) { this._publish('Click', this._payloads[delegateID]) }
	}
})