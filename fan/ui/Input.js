jsio('from shared.javascript import Class');

jsio('import fan.ui.Component');

exports = Class(fan.ui.Component, function(supr) {
	
	this._domTag = 'textarea'
	this._className = 'Input'
	
	this.init = function(defaultText, isPassword) {
		supr(this, 'init')
		this.setText(defaultText)
		this._isPassword = isPassword
		if (this._isPassword) {
			this._domTag = 'input'
			this._domType = 'password'
		}
	}
	
	this.setText = function(text, dontBlur) {
		this._defaultText = text || this._defaultText
		if (this._element) { 
			this._element.value = this._defaultText
			if (!dontBlur) { this._onBlur() }
		}
	}
	
	this.getValue = function() { return this._element.value }
	this.focus = function() { this._element.focus() }
	this.disable = function() { this._element.disabled = true }
	this.clear = function() { setTimeout(bind(this._element, function(){ this.value = '' })) }
	this.blur = function() { this._element.blur() }
	
	this._createContent = function() {
		this._element.value = this._defaultText;
		this._on('keydown', bind(this, '_onKeyDown'))
		this._on('focus', bind(this, '_onFocus'));
		this._on('blur', bind(this, '_onBlur'));
		this.setText()
		
		var keys = this.keys,
			keyMap = this._keyMap = {}
		
		keyMap[keys['enter']] = bind(this, '_publish', 'Submit')
		keyMap[keys['escape']] = bind(this, 'blur')
	}
	
	this._onKeyDown = function(e) {
		var keyHandler = this._keyMap[e.keyCode]
		if (keyHandler) {
			e.cancel()
			keyHandler()
		}
	}

	this._onFocus = function() {
		gKeyboardFocus.grabFocus(this)
		if (this._element.value != this._defaultText) { return; }
		if (this._isPassword) { this._element.type = 'password'; }
		this.removeClassName('defaultValue');
		this._element.value = '';
	}
	
	this._onBlur = function() {
		gKeyboardFocus.releaseFocus(this)
		if (this._element.value != '' && this._element.value != this._defaultText) { return; }
		if (this._isPassword) { this._element.type = 'text'; }
		this.addClassName('defaultValue');
		this.setText(null, true)
	}
})