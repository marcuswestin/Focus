jsio('from shared.javascript import Singleton, bind')

exports = Singleton(function(){
	
	this.init = function() {
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
	
	this._dontPanic = function() {
		var doc = document,
			el = doc.body.appendChild(doc.createElement('div'))
		el.style.fontSize = '82px'
		el.style.color = '#e9e9e9'
		el.style.fontFamily = 'Verdana'
		el.style.fontStyle = 'Italic'
		el.style.position = 'absolute'
		el.innerHTML = "Don't Panic"
		this.addDependant(function(winSize) {
			var width = el.offsetWidth
			var height = el.offsetHeight
			el.style.right = ((winSize.width - 500) / 2) - (width / 2) + 'px' // in the middle on the right off of the panels
			el.style.top = (winSize.height / 2) - (height / 2) + 'px'
		})
	}
	
})
