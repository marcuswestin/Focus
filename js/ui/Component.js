jsio('from common.javascript import Class');
jsio('import common.Publisher');

exports = Class(common.Publisher, function(supr) {
	
	this._domType = 'div'
	this._className = null
	
	this.getElement = function() {
		if (!this._element) { 
			this._element = this.create({ type: this._domType })
			if (this._className) { this.addClassName(this._className) }
			this.createContent()
		}
		return this._element
	}
	
	this.create = function(params) {
		var el = document.createElement(params.type || 'div');
		if (params.className) { el.className = params.className; }
		if (params.html) { el.innerHTML = params.html; }
		if (params.src) { el.src = params.src; }
		if (params.href) { el.href = params.href; }
		if (params.text) { el.appendChild(document.createTextNode(params.text)); }
		if (params.style) { exports.setStyle(el, params.style); }
		if (params.parent) { params.parent.appendChild(el); }
		return el;
	}
	
	this.createContent = function() {} // abstract method
	
	this.addClassName = function(className) { 
		var element = this._element
		if (!(' ' + element.className + ' ').match(' ' + className + ' ')) {
			element.className += ' ' + className + ' ';
		}
	}
	this.removeClassName = function(className) { 
		var element = this._element
		className += ' ';
		var current = element.className;
		var index = current.indexOf(className);
		if (index != -1) {
			element.className = current.slice(0, index) + current.slice(index + className.length);
		}
	}
	this.hasClassName = function(className) {
		return !!this._element.className.match(' ' + className + ' ');
	}
	
	// this.layout({ width: 100, height: 100, top: 10, left: 10 })
	// this.layout(anElement, { width: 10, height: 10 })
	this.layout = function(el, dim) {
		if (!dim) { 
			el = this._element
			dim = el
		}
		for (var key in dim) {
			this._element.style[key] = dim[key] + 'px'
		}
	}
	
	this.show = function() { this.getElement().style.display = 'block'; }
	this.hide = function() { this.getElement().style.display = 'none'; }
	
	this.appendTo = function(element) { element.appendChild(this.getElement()); }
	this.prependTo = function(element) { element.insertBefore(this.getElement(), element.firstChild); }
})
