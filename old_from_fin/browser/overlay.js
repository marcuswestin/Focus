jsio('from common.javascript import Singleton, bind');

jsio('import browser.dimensions as dimensions');
jsio('import browser.dom as dom');
jsio('import browser.events as events');

jsio('import browser.resizeManager');

jsio('import browser.UIComponent');

exports = Singleton(browser.UIComponent, function(supr) {
	
	var barSize = 40;
	
	this.init = function() {
		supr(this, 'init');
		this._resizeCallback = bind(this, 'onWindowResize');
	}
	
	this.createContent = function() {
		this.addClassName('Overlay');
		this._underlay = dom.create({ parent: this._element, className: 'underlay' });
		this._content = dom.create({ parent: this._element, className: 'content' });
		this._closeButton = dom.create({ parent: this._element, className: 'closeButton' });
		events.add(this._closeButton, 'click', bind(this, 'hide'));
	}
	
	this.show = function(content, notDismissable) {
		document.body.appendChild(this.getElement());
		this._content.innerHTML = '';
		this._content.appendChild(content);
		browser.resizeManager.onWindowResize(this._resizeCallback);
		if (notDismissable) {
			this._closeButton.style.display = 'none';
		} else {
			this._closeButton.style.display = 'block';
			this._clickHandler = events.add(this._underlay, 'click', bind(this, 'hide'));
		}
	}
	
	this.hide = function() {
		dom.remove(this._element);
		browser.resizeManager.cancelWindowResize(this._resizeCallback);
		events.remove(this._underlay, 'click', this._clickHandler);
	}
	
	this.onWindowResize = function(size) {
		this.layout(this._underlay, size);
		var contentSize = dimensions.getSize(this._content.firstChild);
		this.layout(this._content, { left: (size.width / 2) - (contentSize.width / 2),
			top: (size.height / 2) - (contentSize.height / 2) - barSize });
		this.layout(this._closeButton, { left: (size.width / 2) + (contentSize.width / 2) - 7,
			top: (size.height / 2) - (contentSize.height / 2) - barSize + 7 });
	}
})