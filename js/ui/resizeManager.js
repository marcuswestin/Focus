module.exports = Class.Singleton(function(){
	
	this._initialize = function() {
		this._resizeCallbacks = []
		window.onresize = bind(this, '_onResize')
		
		this._dontPanic()
	}
	
	this._onResize = function() {
		if (!this._resizeCallbacks.length) { return }
		var size = this.getWindowSize()
		for (var i=0, callback; callback = this._resizeCallbacks[i]; i++) {
			callback(size)
		}
	}
	
	this.onResize = function(callback) {
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
		return { w: window.innerWidth, h: window.innerHeight }
	}
	
	this.fireResize = function() {
		this._onResize()
	}
	
	this._dontPanic = function() {
		var doc = document,
			el = doc.body.appendChild(doc.createElement('div'))
		el.style.fontSize = '82px'
		el.style.color = '#e9e9e9'
		el.style.fontFamily = 'Verdana'
		el.style.fontStyle = 'Italic'
		el.style.position = 'absolute'
		el.innerHTML = "Don't Panic"
		el.className = 'unselectable'
		this.onResize(function(winSize) {
			var width = el.offsetWidth
			var height = el.offsetHeight
			el.style.right = ((winSize.w - 500) / 2) - (width / 2) + 'px' // in the middle on the right off of the panels
			el.style.top = (winSize.h / 1.3) - (height / 1.5) + 'px'
		})
	}
	
})
