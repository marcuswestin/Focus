jsio('from common.javascript import Class')
jsio('import ui.Component')
jsio('import ui.resizeManager')

exports = Class(ui.Component, function(supr) {
	
	this._className = 'Panel'
	this._width = null // override
	this._left = null // override
	this._padding = 14
	
	this._createContent = function() {
		this._content = this._create({ parent: this._element, className: 'content' })
		ui.resizeManager.addDependant(bind(this, '_onWindowResize'))
	}
	
	this._onWindowResize = function(mutation) {
		var winSize = mutation.value
		var height = winSize.height - 100
			padding = this._padding * 2
		this.layout({ height: height, width: this._width, left: this._left })
		this.layout(this._content, { height: height - padding, width: this._width - padding })
	}
})