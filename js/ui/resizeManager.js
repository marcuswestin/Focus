jsio('from common.javascript import Singleton, bind')

exports = Singleton(function(){
	
	this.init = function() {
		this._resizeCallbacks = []
		this._currentSize = this.getWindowSize()
		window.onresize = bind(this, '_onResize')
	}
	
	this._onResize = function() {
		if (!this._resizeCallbacks.length) { return }
		var size = exports.getWindowSize()
		var mutation = { value: size, dWidth: size.width - this._currentSize.width, dHeight: size.height - this._currentSize.height }
		this._currentSize = size
		for (var i=0, callback; callback = this._resizeCallbacks[i]; i++) {
			callback(mutation)
		}
	}
	
	this.addDependant = function(callback) {
		this._resizeCallbacks.push(callback)
		callback({ value: this.getWindowSize() })
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
