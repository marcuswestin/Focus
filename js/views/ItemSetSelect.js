jsio('from shared.javascript import Class, bind, forEach')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr){
	
	this._domTag = 'select'
	this._className = 'Value Select'
	
	// (( ItemSetSelect type project title )) -> list of all items of type project, displayed by title
	this.init = function(jsArgs, viewArgs) {
		supr(this, 'init')
		
		var propertyName = viewArgs[0],
			propertyValue = viewArgs[1],
			displayProperty = viewArgs[2],
			itemId = jsArgs[0]
		
		this._targetProperty = propertyValue
		this._displayProperty = displayProperty
		this._query = {}
		this._query[propertyName] = propertyValue
		this._itemId = itemId
		this._options = {}
	}
	
	this._createContent = function() {
		var itemSet = fin.getItemSet(this._query)
		itemSet.addDependant(bind(this, '_onItemsChange'))

		this._item = fin.getItem(this._itemId)
		this._item.addDependant(this._targetProperty, bind(this, '_onTargetPropertyChange'))
		
		this._on('change', bind(this, '_onSelectionChange'))
	}
	
	this._onItemsChange = function(mutation) {
		forEach(mutation.add, this, function(itemId) {
			if (this._options[itemId]) { return }
			this._options[itemId] = new Option('Loading...', itemId, false, false)
			this._element.add(this._options[itemId], null)
			if (itemId == this._item.getProperty(this._targetProperty)) {
				this._element.selectedIndex = this._element.options.length - 1
			}
			fin.getItem(itemId).addDependant(this._displayProperty, bind(this, '_onDisplayPropertyChange', itemId))
		})
		forEach(mutation.remove, this, function(itemId) {
			for (var i=0, option; option = this._element.options[i]; i++) {
				if (option.value != itemId) { continue }
				this._element.remove(i)
				logger.warn("TODO Remove dependant from item for title")
				break
			}
			delete this._options[itemId]
		})
	}
	
	this._onTargetPropertyChange = function(mutation, targetPropertyValue) {
		for (var i=0, option; option = this._element.options[i]; i++) {
			if (option.value != targetPropertyValue) { continue }
			this._element.selectedIndex = i
			break
		}
	}
	
	this._onDisplayPropertyChange = function(itemId, mutation, displayValue) {
		this._options[itemId].innerHTML = displayValue || 'Loading...'
	}
	
	this._onSelectionChange = function() {
		this._item.setProperty(this._targetProperty, this._element.value)
	}
})