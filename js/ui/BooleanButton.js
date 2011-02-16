var RadioButtons = require('./RadioButtons')

module.exports = Class(RadioButtons, function(supr) {
	
	this.init = function(trueLabel, falseLabel) {
		supr(this, 'init')
		this._trueLabel = trueLabel
		this._falseLabel = falseLabel
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this
			.addButton({ text: this._trueLabel, payload: true })
			.addButton({ text: this._falseLabel, payload: false })
	}
	
	this.reflectSetMembership = function(itemId, setProperty, member) {
		fin.observeSet(itemId, setProperty, bind(this, function(mutation) {
			var memberChange = mutation.args.indexOf(member) != -1
			if (!memberChange) { return }
			if (mutation.op == 'sadd') { this.select(0, true) }
			else if (mutation.op == 'srem') { this.select(1, true) }
		}))
		
		this.subscribe('Click', this, function(value) {
			if (value) { fin.addToSet(itemId, setProperty, member) }
			else { fin.removeFromSet(itemId, setProperty, member) }
		})
		return this
	}
	
	this._onDelegateClick = function(delegateId, e, silent) {
		var currSelected = this._selected,
			newSelected = this._buttons[delegateId]
		
		if (currSelected) { this.removeClassName(currSelected, 'down') }
		this.addClassName(newSelected, 'down')
		this._selected = newSelected
		
		if (!silent) { this._publish('Click', this._payloads[delegateId]) }
	}
})