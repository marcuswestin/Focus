jsio('from common.javascript import Singleton')
jsio('import ui.Component')

exports = Singleton(ui.Component, function(supr) {
	
	this._className = 'TextViewEdit'
	this._padding = 4
	this._border = 2
	
	this._createContent = function() {
		this.hide()
		this._input = fin.getView('Input')
		this._input.appendTo(this._element)
		this._input.subscribe('Blur', bind(this, 'hide'))

		this._input.getElement().style.position = 'absolute'
		this._input.getElement().style.overflow = 'hidden'
		this._input.getElement().style.padding = this._padding + 'px'
	}
	
	this.showAt = function(view, item, property) {
		if (this._view) { logger.log('TODO: release current view') }
		this.appendTo(gBody)
		this._view = view
		var el = this._input.getElement()

		el.style.fontSize = this._view.getStyle('font-size');
		el.style.fontFamily = this._view.getStyle('font-family');
		el.style.fontWeight = this._view.getStyle('font-weight');
		el.style.lineHeight = this._view.getStyle('line-height');

		this._input.setDependant(item, property)
		
		item.requestFocus(bind(this, function(){
			this._element.blur()
			this.hide()
		}))
		
		this._input.setValue(item.getProperty(property))
		
		this._view.subscribe('Resize', bind(this, '_onViewResize'))
		this._onViewResize()
		this.show()
		this._input.focus()
	}
	
	this._onViewResize = function() {
		var layout = this._view.getLayout()
		layout.left -= (this._padding + this._border)
		layout.top -= (this._padding + this._border)
		layout.height += this._padding * 2 + this._border * 2
		layout.width += this._padding * 2 + this._border * 2
		
		this._input.layout(layout)
	}
	
	this.setText = function(text) {
		this._text = text || this._text
		if (this._element) { this._element.innerHTML = this._text }
	}
})