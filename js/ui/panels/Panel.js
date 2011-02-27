var Component = require('../../ui/Component'),
	resizeManager = require('../../ui/resizeManager')

module.exports = Class(Component, function(supr) {
	
	this._className = 'Panel'
	
	this.init = function() {
		supr(this, 'init')
		this._views = {}
	}
	
	this._createContent = function() {
		resizeManager.onResize(bind(this, '_onWindowResize'))
	}
	
	this._onWindowResize = function(winSize) {
		var height = this._lastHeight = winSize.h - 25
		this._element.style.height = height + 'px'
		if (this._view) { this._view.setHeight(height) }
	}
	
	this._setView = function(view) {
		// fade out current view
		// get new view's width
		// resize to new width
		// 		remove current view
		//		fade in new view
		var currentView = this._view
		if (currentView) {
			currentView.release()
			currentView.remove() // TODO fade
		}
		var viewEl = view.getElement() // force _createContent
		view.setHeight(this._lastHeight)
		this._element.appendChild(viewEl) // TODO fade in
		this._view = view
		this._resize()
	}
	
	this._resize = function() {
		var takenWidth = this._view.setWidth(this._lastMaxWidth)
		this._element.style.width = takenWidth + 'px' // TODO animate resize
		this._publish('Resize', takenWidth)
		// gKeyboardFocus.updatePosition(false)
	}
	
	this.handleKeyboardFocus = function(el) {
		if (!this._view) { return }
		this._view.handleKeyboardFocus(el)
	}
})