jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'KeyboardFocus'
	this._borderWidth = 7
	
	this.init = function() {
		supr(this, 'init')
		this._on(document, 'keydown', bind(this, '_onKeyDown'))
		this._on(document, 'keyup', bind(this, '_onKeyUp'))
		
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
	
	this.shiftIsDown = function() { return this._shiftIsDown }

	this.grabFocus = function(uiComponent) { this._focusedUIComponent = uiComponent }
	this.releaseFocus = function(uiComponent) {
		if (uiComponent != this._focusedUIComponent) { return }
		delete this._focusedUIComponent
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
	
	this._onKeyDown = function(e) {
		if (e.keyCode == this.keys['shift']) { this._shiftIsDown = true }
		if (this._focusedUIComponent) { return }
		if (this._keyMap[e.keyCode]) {
			e.cancel()
			setTimeout(this._keyMap[e.keyCode])
		} 
	}
	
	this._onKeyUp = function(e) {
		if (e.keyCode == this.keys['shift']) { this._shiftIsDown = false }
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
		var panel = gPanels[this._panelIndex]
		if (!panel) { return }
		
		var newFocusIndex = this._focusIndex[this._panelIndex] + steps,
			targetEls = panel.getElement().getElementsByClassName('fan-focusable')
		
		if (newFocusIndex < 0) { return }
		if (newFocusIndex >= targetEls.length) { newFocusIndex = targetEls.length - 1 }
		this._focusIndex[this._panelIndex] = newFocusIndex
		
		this._targetEl = targetEls[newFocusIndex]
		this._target = this._getFocusableComponent(this._targetEl)
		
		this
			.appendTo(document.body)
			.updatePosition(false)
	}
	
	this._selectFocusedItem = function() {
		var target = this._target,
			targetEl = this._targetEl
		if (!target || !targetEl) { return }
		target.handleKeyboardSelect(targetEl)
	}
	
	this.updatePosition = function(suppressForward) {
		if (!this._targetEl) { return }
		if (!suppressForward) { gPanels[this._panelIndex].handleKeyboardFocus(this._targetEl) }
		
		var targetEl = this._targetEl,
			focusPadding = 2,
			borderWidth = this._borderWidth,
			layout = this.getLayout(targetEl)
		
		layout.w += focusPadding * 2 + 10
		layout.h += focusPadding * 2
		layout.x -= focusPadding
		layout.y -= focusPadding
		
		this.layout(this._top, { y: layout.y - borderWidth, x: layout.x - borderWidth, w: layout.w + borderWidth })
		this.layout(this._bottom, { y: layout.y + layout.h, x: layout.x - borderWidth, w: layout.w + borderWidth })
		this.layout(this._left, { y: layout.y, x: layout.x - borderWidth, h: layout.h })
		this.layout(this._right, { y: layout.y, x: layout.x + layout.w - borderWidth, h: layout.h })
	}
})