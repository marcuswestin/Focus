jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'KeyboardFocus'
	this._borderWidth = 7
	
	this.init = function() {
		supr(this, 'init')
		this._on(document, 'keydown', bind(this, '_onKeyDown'))
		
		this._panelIndex = -1
		this._focusIndex = {}
		this._keyMap = {}

		var keys = this.keys,
			keyMap = this._keyMap
		
		keyMap[keys['k']] = keyMap[keys['w']] = keyMap[keys['up arrow']] = bind(this, '_moveFocus', -1) 
		keyMap[keys['j']] = keyMap[keys['s']] = keyMap[keys['down arrow']] = bind(this, '_moveFocus', 1) 
		keyMap[keys['`']] = keyMap[keys['a']] = keyMap[keys['left arrow']] = bind(this, '_movePanel', -1)
		keyMap[keys['tab']] = keyMap[keys['d']] = keyMap[keys['right arrow']] = bind(this, '_movePanel', 1)
		
		keyMap[keys['enter']] = bind(this, '_selectFocusedItem')
		
		keyMap[keys['1']] = bind(gListPanel, 'selectAppByIndex', 0)
		keyMap[keys['2']] = bind(gListPanel, 'selectAppByIndex', 1)
		keyMap[keys['3']] = bind(gListPanel, 'selectAppByIndex', 2)
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
			setTimeout(callback)
		} 
	}
	
	this._movePanel = function(steps) {
		var newPanelIndex = this._panelIndex + steps
		if (newPanelIndex < 0 || newPanelIndex >= gPanels.length) { return }
		if (typeof this._focusIndex[newPanelIndex] != 'number') {
			this._focusIndex[newPanelIndex] = 0
		}
		this._panelIndex = newPanelIndex
		this._moveFocus(0)
	}
	
	this._moveFocus = function(steps) {
		var panel = gPanels[this._panelIndex];
		if (!panel) { return }
		
		var newFocusIndex = this._focusIndex[this._panelIndex] + steps,
			targetEls = panel.getElement().getElementsByClassName('fan-focusable')
		
		if (newFocusIndex < 0) { return; }
		if (newFocusIndex >= targetEls.length) { newFocusIndex = targetEls.length - 1 }
		this._focusIndex[this._panelIndex] = newFocusIndex
		
		var targetEl = this._targetEl = targetEls[newFocusIndex],
			target = this._target = this._getFocusableComponent(targetEl)
		
		this
			.appendTo(document.body)
			.updatePosition()
	}
	
	this._selectFocusedItem = function() {
		var target = this._target,
			targetEl = this._targetEl
		if (!target || !targetEl) { return }
		target.handleKeyboardSelect(targetEl)
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
	
	this.updatePosition = function() {
		if (!this._targetEl) { return }
		
		var targetEl = this._targetEl,
			focusPadding = 2,
			borderWidth = this._borderWidth,
			layout = this.getLayout(targetEl)
		
		layout.width += focusPadding * 2 + 10;
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