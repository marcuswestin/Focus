jsio('from common.javascript import Singleton, bind')

exports = Singleton(function(){
	
	this.init = function() {
		this._resizeCallbacks = []
		window.onresize = bind(this, '_onResize')
	}
	
	this._onResize = function() {
		if (!this._resizeCallbacks.length) { return }
		var size = this.getWindowSize()
		for (var i=0, callback; callback = this._resizeCallbacks[i]; i++) {
			callback(size)
		}
	}
	
	this.addDependant = function(callback) {
		this._resizeCallbacks.push(callback)
		callback(this.getWindowSize())
	}
	
	this.removeDependant = function(targetCallback) {
		for (var i=0, callback; callback = this._resizeCallbacks[i]; i++) {
			if (callback != targetCallback) { continue }
			this._resizeCallbacks.splice(i, 1)
			return
		}
	}
	
	this.getWindowSize = function() {
		return { width: window.innerWidth, height: window.innerHeight }
	}
	
	this.fireResize = function() {
		this._onResize()
	}
	
})
