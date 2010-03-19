jsio('from shared.javascript import Class, bind, forEach');
jsio('import shared.ItemReference');
jsio('import client.events as events');
jsio('import client.dom as dom');
jsio('import client.css as css');
jsio('import client.ItemView');
jsio('import client.views.ItemReferenceView');
jsio('import client.ListComponent');
jsio('import client.panels.Panel');

css.loadStyles(jsio.__path);

exports = Class(client.panels.Panel, function(supr) {
	
	this.init = function() {
		supr(this, 'init', arguments);

		this._listComponent = new client.ListComponent();
	}
	
	this.createContent = function() {
		supr(this, 'createContent');
		this.addClassName('ItemPanel');
		this._itemView = new client.ItemView(this._item, this._item.getType(), 'panel');
		this._itemView.appendTo(this._content);
		var views = this._itemView.getPropertyViews();
		forEach(views, bind(this._listComponent, 'addItem'));
		if (this.hasFocus()) { this._listComponent.focus(); }
	}
	
	this.focus = function() {
		supr(this, 'focus');
		if (this.isMinimized()) { return; }
		this._listComponent.focus();
	}
})