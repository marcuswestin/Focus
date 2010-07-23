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
		this._defaultGroup = this._createGroup()
		this.addClassName(this._defaultGroup, 'default')
		this._queryId = fin.query(this._query, bind(this, '_onQueryUpdated'))
	}
	
	this._onQueryUpdated = function(mutation) { 
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
	
	this._onGroupPropChange = function(itemId, op, itemGroup) {
		var groups = this._groupsByValue,
			currentGroup = this._groupsById[itemId],
			newGroup
		
		if (currentGroup) { // should we hide current group?
			var holder = currentGroup.childNodes[1]
			if (holder.childNodes.length == 1) {
				currentGroup.style.display = 'none'
			}
		}
		
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

