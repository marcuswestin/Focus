var Class = require('../Class'),
	ValueView = require('./Value')

module.exports = Class(ValueView, function(supr){
	
	this._className += ' ItemSetSelect'
	
	// (( ItemSetSelect type project title )) -> list of all items of type project, displayed by title
	this.init = function(args) {
		supr(this, 'init', [args])
		
		var propertyValue = args[2],
			displayProperty = args[3]
		
		this._targetProperty = propertyValue
		this._displayProperty = displayProperty
		this._query = {}
		this._query[this._property] = propertyValue
		this._options = {}
	}
	
	this.handleKeyboardSelect = function() { /* There's no way to make a select element open :( */ }
	
	this._createContent = function() {
		this._select = this._create({ tag: 'select', parent: this._element })
		
		var queryId = fin.query(this._query, bind(this, '_onItemsChange'))
		
		fin.observe(this._itemId, this._targetProperty, bind(this, '_onTargetPropertyChange'))
		
		this._on('change', bind(this, '_onSelectionChange'))
		
		this._makeFocusable()
	}
	
	this._onItemsChange = function(mutation) {
		var selectEl = this._select
		if (mutation.op == 'sadd') {
			forEach(mutation.args, this, function(itemId) {
				if (this._options[itemId]) { return }
				this._options[itemId] = new Option('Loading...', itemId, false, false)
				selectEl.add(this._options[itemId], null)
				if (itemId == this._targetItemId) {
					selectEl.selectedIndex = selectEl.options.length - 1
				}
				fin.observe(itemId, this._displayProperty, bind(this, '_onDisplayPropertyChange', itemId))
			})
		} else if (mutation.op == 'srem') {
			forEach(mutation.args, this, function(itemId) {
				for (var i=0, option; option = selectEl.options[i]; i++) {
					if (option.value != itemId) { continue }
					selectEl.remove(i)
					logger.warn("TODO Remove dependant from item for title")
					break
				}
				delete this._options[itemId]
			})
		}
	}
	
	this._onTargetPropertyChange = function(mutation, targetPropertyValue) {
		var selectEl = this._select
		this._targetItemId = targetPropertyValue
		for (var i=0, option; option = selectEl.options[i]; i++) {
			if (option.value != targetPropertyValue) { continue }
			selectEl.selectedIndex = i
			break
		}
	}
	
	this._onDisplayPropertyChange = function(itemId, mutation, displayValue) {
		this._options[itemId].innerHTML = displayValue || 'Loading...'
	}
	
	this._onSelectionChange = function() {
		fin.set(this._itemId, this._targetProperty, this._select.value)
	}
})