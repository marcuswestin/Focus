var Component = require('../../ui/Component'),
	resizeManager = require('../../ui/resizeManager')

module.exports = Class(Component, function(supr) {
	
	this._className = 'Panel'
	this._width = null // override
	
	this._createContent = function() {
		resizeManager.addDependant(bind(this, '_onWindowResize'))
	}
	
	this._onWindowResize = function(winSize) {
		var height = this._lastHeight = winSize.h - 25
		this._element.style.height = height + 'px'
		if (this._currentView) { this._currentView.setHeight(height) }
	}
	
	this._setView = function(view) {
		// fade out current view
		// get new view's width
		// resize to new width
		// 		remove current view
		//		fade in new view
		var currentView = this._currentView
		if (currentView) {
			currentView.release()
			currentView.remove() // TODO fade
		}
		var viewEl = view.getElement() // force _createContent
		view.setHeight(this._lastHeight)
		this._element.appendChild(viewEl) // TODO fade in
		this._currentView = view
		this._resize()
	}
	
	this._resize = function() {
		var takenWidth = this._currentView.setWidth(this._lastMaxWidth)
		this._element.style.width = takenWidth + 'px' // TODO animate resize
		this._publish('Resize', takenWidth)
		gKeyboardFocus.updatePosition(false)
	}
	
	this.handleKeyboardFocus = function(el) {
		if (!this._currentView) { return }
		this._currentView.handleKeyboardFocus(el)
	}
})