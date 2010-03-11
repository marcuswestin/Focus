jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ItemPanel'
	this._width = null // dynamic
	this._left = 420
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._content.innerHTML = 'Item'
	}
	
	this._onWindowResize = function(winSize) {
		var leftPadding = 10,
			rightPadding = 250
		this._width = winSize.width - this._left - leftPadding - rightPadding
		supr(this, '_onWindowResize', arguments)
	}
})