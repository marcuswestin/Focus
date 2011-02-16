var List = require('./List')

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
module.exports = Class(List, function(supr){
	
	this._className += ' SortedList'
	
	this.reflectSortedSet = function(itemID, setPropertyName) {
		this._itemID = itemID
		this._propertyName = setPropertyName
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
		this._defaultGroup = this._createGroup()
		this.addClassName(this._defaultGroup, 'default')
		
		this._queryId = fin.observeSet(this._itemID, this._propertyName, bind(this, '_onSetUpdated'))
	}
	
	this._onSetUpdated = function(mutation) {
		if (mutation.op == 'sadd') { this.addItems(mutation.args) }
		if (mutation.op == 'srem') { this.removeItems(mutation.args) }
	}
	
	this._addItem = function(itemId) {
		var item = new SortableItem(itemId)
		if (this._sortBy) {
			this._observe(itemId, this._sortBy, bind(this, '_onSortPropChange', itemId))
		}
		if (this._groupBy) {
			this._observe(itemId, this._groupBy, bind(this, '_onGroupPropChange', itemId))
		}
		this._items.push(item)
		this._itemsById[itemId] = item
		return item
	}
	
	this._removeItem = function(itemId, itemsIndex) {
		supr(this, '_removeItem', arguments)
		if (this._sortBy) { this._release(itemId, this._sortBy) }
		if (this._groupBy) { this._release(itemId, this._groupBy) }
		this._removeCellFromGroup(itemId)
	}
	
	this._onSortPropChange = function(itemId, op, value) {
		this._itemsById[itemId].setSortValue(value)
		this._render()
	}
	
	this._getParentFor = function(item) {
		var itemID = this._getItemId(item),
			group = this._groupsById && this._groupsById[itemID] || this._defaultGroup
		return group.childNodes[1]
	}
	
	this.createDelayedMethod('_render', function() {
		this._items.sort()
		supr(this, '_render')
	})
	
	this._removeCellFromGroup = function(itemID) {
		var group = this._groupsById[itemID],
			cell = this._cells[itemID]
		
		if (!group || !cell) { return }
		
		var holder = group.childNodes[1]
		holder.removeChild(cell)
		if (!holder.childNodes.length) {
			group.style.display = 'none'
		}
	}
	
	this._onGroupPropChange = function(itemId, op, itemGroup) {
		var groups = this._groupsByValue,
			currentGroup = this._groupsById[itemId],
			newGroup
		
		this._removeCellFromGroup(itemId)
		
		newGroup = groups[itemGroup]
		if (!itemGroup) { // was the item removed from a group?
			newGroup = this._defaultGroup
		} else if (!newGroup) {
			newGroup = groups[itemGroup] = this._createGroup()
			fin.observe(itemGroup, this._groupDisplayProp, function(op, groupTitle) { 
				var header = newGroup.childNodes[0]
				header.innerHTML = groupTitle
			})
		}
		
		newGroup.style.display = 'block' // make sure we're showing current group
		
		this._groupsById[itemId] = newGroup
		this._render()
	}
	
	this._createGroup = function() {
		var group = this._create({ className: 'group', parent: this._element }),
			header = this._create({ className: 'header', parent: group }),
			holder = this._create({ className: 'holder', parent: group })
		return group
	}
})

