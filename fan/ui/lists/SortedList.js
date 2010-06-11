jsio('from shared.javascript import Class, bind, delayedFunction')
jsio('import fan.ui.lists.List')

var SortableItem = Class(function() {
	this.init = function(id) { this._id = id }
	this.getId = function() { return this._id }
	this.toString = function() { 
		var sortValue = (this._sortValue ? this._sortValue : 'zzz') + ':' + this._id // zzz is there to come last
		return sortValue.toLowerCase()
	}
	this.setSortValue = function(value) { this._sortValue = value }
})

// TODO Move all the methods of this SortedList into List
exports = Class(fan.ui.lists.List, function(supr){
	
	this._className += ' SortedList'
	
	this.query = function(query) {
		this._query = query
		return this
	}
	
	this.sortBy = function(sortBy) {
		this._sortBy = sortBy
		return this
	}
	
	this.groupBy = function(groupBy, displayProp) {
		this._groupBy = groupBy
		this._groupDisplayProp = displayProp
		this._groupsById = {}
		this._groupsByValue = {}
		return this
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._defaultGroup = this._create({ className: 'group', parent: this._element })
		this._queryId = fin.query(this._query, bind(this, '_onQueryUpdated'))
	}
	
	this._onQueryUpdated = function(mutation) { 
		if (mutation.op == 'sadd') { this.addItems(mutation.args) }
		if (mutation.op == 'srem') { this.removeItems(mutation.args) }
	}
	
	this._addItem = function(itemId) {
		var item = new SortableItem(itemId)
		if (this._sortBy) {
			fin.observe(itemId, this._sortBy, bind(this, '_onSortPropChange', itemId))
		}
		if (this._groupBy) {
			fin.observe(itemId, this._groupBy, bind(this, '_onGroupPropChange', itemId))
		}
		this._items.push(item)
		this._itemsById[itemId] = item
		return item
	}
	
	this._onSortPropChange = function(itemId, op, value) {
		this._itemsById[itemId].setSortValue(value)
		this._render()
	}
	
	this._getParentFor = function(itemId) {
		return this._groupsById && this._groupsById[itemId] || this._defaultGroup
	}
	
	this.createDelayedMethod('_render', function() {
		this._items.sort()
		supr(this, '_render')
	})
	
	this._onGroupPropChange = function(itemId, op, value) {
		if (!value) {
			delete this._groupsById[itemId]
			return
		}
		var groups = this._groupsByValue
		if (!groups[value]) {
			groups[value] = this._create({ className: 'group', parent: this._element })
			var header = this._create({ className: 'header', parent: groups[value] })
			fin.observe(value, this._groupDisplayProp, function(op, value) { header.innerHTML = value })
		}
		this._groupsById[itemId] = groups[value]
		this._render()
	}
})

