jsio('from common.javascript import Singleton, bind')
jsio('import ui.resizeManager')
jsio('import ui.Component')

exports = Singleton(ui.Component, function(supr) {
	
	this._className = 'Overlay'
	
	this.init = function() {
		supr(this, 'init');
		this._resizeCallback = bind(this, '_onWindowResize');
	}
	
	this._createContent = function() {
		this._underlay = this._create({ parent: this._element, className: 'underlay' });
		this._content = this._create({ parent: this._element, className: 'content' });
	}
	
	this.show = function(content, notDismissable) {
		this.getElement()
		this._content.innerHTML = ''
		this._content.appendChild(content)
		document.body.appendChild(this.getElement())
		ui.resizeManager.addDependant(this._resizeCallback)
	}
	
	this._hide = function() {
		this.remove()
		ui.resizeManager.removeDependant(this._resizeCallback)
	}
	
	this._onWindowResize = function(mutation) {
		var size = mutation.value
		this.layout(this._underlay, size)
		var contentSize = this.getLayout(this._content.firstChild)
		this.layout(this._content, { left: (size.width / 2) - (contentSize.width / 2),
			top: (size.height / 2) - (contentSize.height / 2) });
	}
})