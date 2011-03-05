var List = require('./List')

var SortableItem = Class(function() {
	this._initialize = function(id) { this._id = id }
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
	
	this._initialize = function() {
		supr(this, '_initialize', arguments)
		this._groupsById = {}
		this._groupsByValue = {}
	}
	
	this.groupBy = function(groupBy, displayProp) {
		this._groupBy = groupBy
		this._groupDisplayProp = displayProp
		return this
	}
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._defaultGroup = this._createGroup()
		this.addClassName(this._defaultGroup, 'default')
	}
	
	this._addItem = function(item) {
		var sortableItem = new SortableItem(item._id)
		if (this._sortBy) { item[this._sortBy].observe(bind(this, '_onSortPropChange', sortableItem)) }
		if (this._groupBy) { item[this._sortBy].observe(bind(this, '_onGroupPropChange', sortableItem)) }
		this._items.push(sortableItem)
	}
	
	this._removeItem = function(item, itemsIndex) {
		supr(this, '_removeItem', arguments)
		if (this._sortBy) { this._release(itemId, this._sortBy) }
		if (this._groupBy) { this._release(itemId, this._groupBy) }
		this._removeCellFromGroup(item)
	}
	
	this._onSortPropChange = function(sortableItem, value) {
		sortableItem.setSortValue(value)
		this._render()
	}
	
	this._getParentFor = function(item) {
		var group = this._groupsById[item._id] || this._defaultGroup
		return group.childNodes[1]
	}
	
	this.createDelayedMethod('_render', function() {
		this._items.sort()
		supr(this, '_render')
	})
	
	this._removeCellFromGroup = function(item) {
		var group = this._groupsById[item._id],
			cell = this._cells[item._id]
		
		if (!group || !cell) { return }
		
		var holder = group.childNodes[1]
		holder.removeChild(cell)
		if (!holder.childNodes.length) {
			group.style.display = 'none'
		}
	}
	
	this._onGroupPropChange = function(item, value) {
		var groups = this._groupsByValue,
			currentGroup = this._groupsById[item._id],
			newGroup
		
		this._removeCellFromGroup(item)
		
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
		
		this._groupsById[item._id] = newGroup
		this._render()
	}
	
	this._createGroup = function() {
		var group = this._create({ className: 'group', parent: this._element }),
			header = this._create({ className: 'header', parent: group }),
			holder = this._create({ className: 'holder', parent: group })
		return group
	}
})

