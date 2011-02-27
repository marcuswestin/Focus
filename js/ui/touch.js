jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports.Body = Class(fan.ui.Component, function(supr) {
	
	this._initialize = function() {
		this._element = document.body
		this._on('touchmove', bind(this, '_onTouchMove'))
	}
	
	this._onTouchMove = function(e) {
		// Disable dragging of UI outside of viewport
		e.cancel()
	}
	
})