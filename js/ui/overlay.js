var Component = require('./Component'),
	resizeManager = require('./resizeManager')

module.exports = Class.Singleton(Component, function(supr) {
	
	this._className = 'Overlay'
	
	this.init = function() {
		supr(this, 'init');
		this._resizeCallback = bind(this, '_onWindowResize');
	}
	
	this._createContent = function() {
		this._underlay = this._create({ parent: this._element, className: 'underlay' });
		this._content = this._create({ parent: this._element, className: 'content' });
	}
	
	this.show = function(content, dontLightbox) {
		var el = this.getElement(),
			underlay = this._underlay
			
		this._dontLightbox = dontLightbox
		this._content.innerHTML = ''
		this._content.appendChild(content)
		this.toggleClassName('lightbox', !dontLightbox)
		
		underlay.style.opacity = dontLightbox ? .15 : .89;
		document.body.appendChild(el)
		resizeManager.onResize(this._resizeCallback)
		if (dontLightbox) { this._on(underlay, 'click', bind(this, 'hide')) }
	}
	
	this.hide = function(unhookClick) {
		this.remove()
		resizeManager.removeDependant(this._resizeCallback)
	}
	
	this._onWindowResize = function(size) {
		this.layout(this._underlay, size)
		if (this._dontLightbox) {
			this.layout(this._content, { x: 0, y: 0 })
		} else {
			var contentSize = this.getLayout(this._content.firstChild)
			this.layout(this._content, { x: (size.w / 2) - (contentSize.w / 2), y: (size.h / 2) - (contentSize.h / 2) })
		}
	}
})