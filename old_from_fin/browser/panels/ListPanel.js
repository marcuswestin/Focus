jsio('from shared.javascript import Class, bind');
jsio('import client.dimensions');
jsio('import client.events as events');
jsio('import client.dom as dom');
jsio('import client.css as css');
jsio('import client.itemFocus');
jsio('import client.ItemView');
jsio('import client.ListComponent');

jsio('import client.panels.Panel');

css.loadStyles(jsio.__path);

exports = Class(client.panels.Panel, function(supr) {
	
	this.init = function() {
		supr(this, 'init', arguments);
		this._label = this._item;
		this._listComponent = new client.ListComponent(bind(this, '_onItemSelected'), 
			bind(this, '_onItemFocused'));
	}
	
	this.createContent = function() {
		supr(this, 'createContent');
		this.addClassName('ListPanel');
		events.add(this._content, 'scroll', bind(this, '_onScroll'));
	}
	
	this.addItem = function(item) {
		item.addClassName('listItem');
		this._content.appendChild(item.getElement());
		this._listComponent.addItem(item);
		if (this.hasFocus()) { this._listComponent.focus(); }
		this._manager.layout();
	}
	
	this.focus = function() {
		supr(this, 'focus');
		if (this.isMinimized()) { return; }
		this._listComponent.focus();
	}
	
	this._onItemSelected = function(item) {
		this._publish('ItemSelected', item);
	}
	
	this._onScroll = function() {
		client.itemFocus.layout();
	}
	
	this._onItemFocused = function(item) {
		var itemDimensions = client.dimensions.getDimensions(item.getElement());
		if (itemDimensions.top + itemDimensions.height > this._layout.height) {
			this._content.scrollTop += itemDimensions.height;
			return true; // to prevent updating position of focus until scroll event fires
		} else if (itemDimensions.top < this._content.scrollTop) {
			this._content.scrollTop -= itemDimensions.height;
			return true; // to prevent updating position of focus until scroll event fires
		}
	}
})