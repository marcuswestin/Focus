jsio('from common.javascript import Class')
jsio('import tasks.panels.Panel')

exports = Class(tasks.panels.Panel, function(supr) {
	
	this._className += ' ListPanel'
	this._width = 200
	this._left = 200
	
	this._createContent = function() {
		supr(this, '_createContent')
		this._content.innerHTML = 'List'
	}
	
})