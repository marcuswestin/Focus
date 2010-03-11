jsio('from common.javascript import Class')
jsio('import ui.Component')

exports = Class(ui.Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this.createContent = function() {
		this.create({ type: 'input', parent: this._element })
	}
	
	this.onConnected = function() {
		
	}
})