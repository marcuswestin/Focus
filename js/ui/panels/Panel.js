var Component = require('../../ui/Component'),
	resizeManager = require('../../ui/resizeManager')

module.exports = Class(Component, function(supr) {
	
	this._className = 'Panel'
	this._headerHeight = 40
	
	this._initialize = function() {
		supr(this, '_initialize')
		this._views = {}
	}
	
	this.resize = function(availableWidth, height) {
		if (!this._view) { return 0 }
		this._view.setStyle({ top:this._headerHeight })
		var takenWidth = this._view.resize(availableWidth, height - this._headerHeight)
		this.setStyle({ width:takenWidth, height:height })
		return takenWidth
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
		this._element.appendChild(viewEl) // TODO fade in
		this._view = view
		this._publish("NewView")
	}
})