jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'KeyboardFocus'
	this._borderWidth = 7
	
	this.init = function() {
		supr(this, 'init')
		this._on(document, 'keydown', bind(this, '_onKeyDown'))
		
		this._focusIndex = -1
		this._panelIndex = -1
		this._keyMap = {}

		var keys = this.keys,
			keyMap = this._keyMap
		
		keyMap[keys['j']] = bind(this, '_moveFocus', 1) 
		keyMap[keys['k']] = bind(this, '_moveFocus', -1) 
		keyMap[keys['up arrow']] = this._keyMap[keys['j']]
		keyMap[keys['down arrow']] = this._keyMap[keys['k']]
		keyMap[keys['enter']] = bind(this, '_selectFocusedItem'),
		keyMap[keys['tab']] = bind(this, '_movePanel', 1)
		keyMap[keys['`']] = bind(this, '_movePanel', -1)
	}
	
	this.grabFocus = function(uiComponent) { this._focusedUIComponent = uiComponent }
	this.releaseFocus = function(uiComponent) {
		if (uiComponent != this._focusedUIComponent) { return }
		delete this._focusedUIComponent
	}

	this._onKeyDown = function(e) {
		if (this._focusedUIComponent) { return }
		var callback = this._keyMap[e.keyCode]
		if (callback) {
			e.cancel()
			callback()
		} 
	}
	
	this._movePanel = function(steps) {
		var newPanelIndex = this._panelIndex + steps
		if (newPanelIndex < 0 || newPanelIndex >= gPanels.length) { return }
		this._focusIndex = -1
		this._panelIndex = newPanelIndex
		this._moveFocus(1)
	}
	
	this._moveFocus = function(steps) {
		var panel = gPanels[this._panelIndex];
		if (!panel) { return }
		
		var newFocusIndex = this._focusIndex + steps,
			targets = panel.getElement().getElementsByClassName('fan-focusable')
		
		if (newFocusIndex < 0 || newFocusIndex >= targets.length) { return; }
		this._targetEl = targets[newFocusIndex]
		this._focusIndex = newFocusIndex
		this._showAt(this._targetEl)
	}
	
	this._selectFocusedItem = function() {
		var targetEl = this._targetEl
		if (!targetEl) { return }
		this._getFocusableComponent(targetEl).handleKeyboardSelect(targetEl)
	}
	
	this._createContent = function() {
		var borderWidth = this._borderWidth

		this._top = this._create({ className: 'piece top', parent: this._element })
		this._left = this._create({ className: 'piece left', parent: this._element })
		this._right = this._create({ className: 'piece right', parent: this._element })
		this._bottom = this._create({ className: 'piece bottom', parent: this._element })
		
		this._left.style.width = this._right.style.width = borderWidth + 'px'
		this._top.style.height = this._bottom.style.height = borderWidth + 'px'
	}
	
	this._showAt = function(targetEl) {
		var focusPadding = 2,
			borderWidth = this._borderWidth,
			layout = this.getLayout(targetEl)
		
		document.body.appendChild(this.getElement())
		
		layout.width += focusPadding * 2;
		layout.height += focusPadding * 2;
		layout.left -= focusPadding;
		layout.top -= focusPadding;
		
		this.layout(this._top, { top: layout.top - borderWidth, left: layout.left - borderWidth, 
			width: layout.width + borderWidth });
		this.layout(this._bottom, { top: layout.top + layout.height, left: layout.left - borderWidth, 
			width: layout.width + borderWidth });
		this.layout(this._left, { top: layout.top, left: layout.left - borderWidth, height: layout.height });
		this.layout(this._right, { top: layout.top, left: layout.left + layout.width - borderWidth, 
			height: layout.height });
	}
})