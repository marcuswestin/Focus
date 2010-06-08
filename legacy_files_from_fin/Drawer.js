jsio('from shared.javascript import Class, bind');

jsio('import client.css as css');
jsio('import client.events as events');
jsio('import client.dimensions as dimensions');
jsio('import client.dom as dom');

jsio('import client.resizeManager');
jsio('import client.UIComponent');
jsio('import client.Label');
jsio('import client.ItemView');
jsio('import client.panels.ListPanel');

css.loadStyles(jsio.__path);

exports = Class(client.UIComponent, function(supr) {
	
	var margin = { top: 10, bottom: 50 };
	var padding = 3;
	var handleWidth = 10;
	var minHeight = 100;
	var width = 170;
	var marginLeft = 10;
	
	this.init = function() {
		supr(this, 'init');
		this._itemViewClickCallback = bind(this, '_onItemViewClick');
		this._labelListPanel = new client.panels.ListPanel(this, 'Drawer');
		this._labelListPanel._contentMargin = 0;
	}
	
	this.createContent = function() {
		this.addClassName('Drawer');
		this._labelListPanel.appendTo(this._element);
		this._labelListPanel.addClassName('labelListPanel')
 		this._labelListPanel.subscribe('ItemSelected', bind(this, '_onLabelSelected'));
		
		var addLabelLink = dom.create({ parent: this._labelListPanel.getElement(), 
			className: 'addLabelLink', html: '+ add label' });
		events.add(addLabelLink, 'click', gCreateLabelFn);

		this.layout();
	}
	
	this.focusLeftmost = function() {
		this._labelListPanel.focus();
	}
	this.focus = function() {
		if (this._labelViewPanel) {
			this._labelViewPanel.focus();
		} else {
			this._labelListPanel.focus();
		}
	}

	this.focusPanel = function() {
		if (!this._labelViewPanel) { return; }
		this.addClassName('labelListOpen');
		this._labelViewPanel.focus();
	}
	this.removePanel = function(panel) {
		if (!panel || panel != this._labelViewPanel) { return; }
		this.removeClassName('labelListOpen');
		this._labelViewPanel.unsubscribe('ItemSelected', this._itemViewClickCallback);
		dom.remove(this._labelViewPanel.getElement());
		this._labelViewPanel = null;
		client.resizeManager.fireResize();
		this.focus();
	}
	
	this.layout = function() {
		var size = dimensions.getSize(window);
		var height = Math.max(minHeight, size.height - margin.top - margin.bottom);
		var panelWidth = 0;
		this._labelListPanel.layout({ height: height, width: width, top: margin.top, left: marginLeft });
		if (this._labelViewPanel) {
			if (this._labelViewPanel.isMinimized()) {
				panelWidth = 30;
				this._labelViewPanel.layout({ height: height });
			} else {
				panelWidth = 320;
				this._labelViewPanel.layout({ width: panelWidth + 2, height: height, 
					top: margin.top, left: width + marginLeft + 6 });
			}
		}
		return { width: width + panelWidth + marginLeft, height: height, top: margin.top };
	}
	
	this.addLabels = function(labels) {
		for (var i=0, label; label = labels[i]; i++) {
			var item = new client.Label(label);
			this._labelListPanel.addItem(item);
		}
	}
	
	this._onLabelSelected = function(label) {
		if (this._labelViewPanel && this._labelViewPanel.getLabel() == label) { return; }
		
		this.removePanel(this._labelViewPanel);
		
		gClient.getItemsForLabel(label, bind(this, '_onLabelItemsReceived'));
		this._labelViewPanel = new client.panels.ListPanel(this, label);
		this._labelViewPanel.appendTo(this._element);
		this._labelViewPanel.addClassName('labelViewPanel');
		this._labelViewPanel.subscribe('ItemSelected', this._itemViewClickCallback);
		this._labelViewPanel.close = bind(this, function(){
			if (this._labelViewPanel.isMinimized()) {
				this._labelViewPanel.maximize();
			} else {
				this._labelViewPanel.minimize();
			}
			this._labelViewPanel.focus();
			client.resizeManager.fireResize();
		});
		
		this.focusPanel();
		client.resizeManager.fireResize();
	}
	
	this._onLabelItemsReceived = function(label, items) {
		for (var i=0, item; item = items[i]; i++) { 
			var itemView = new client.ItemView(item, item.getType(), 'list');
			this._labelViewPanel.addItem(itemView);
		}
	}
	
	this._onItemViewClick = function(itemView) {
		gPanelManager.showItem(itemView.getItem());
	}
})
