jsio('from shared.javascript import Class');

jsio('import fan.ui.Component');

exports = Class(fan.ui.Component, function(supr) {
	
	this._domTag = 'input'
	this._className = 'Input'
	
	this.init = function(defaultText, isPassword) {
		supr(this, 'init');
		this.setText(defaultText)
		this._isPassword = isPassword;
	}
	
	this.setText = function(text, dontBlur) {
		this._defaultText = text || this._defaultText
		if (this._element) { 
			this._element.value = this._defaultText
			if (!dontBlur) { this._onBlur() }
		}
	}
	
	this._createContent = function() {
		this._element.type = 'text';
		this._element.value = this._defaultText;
		this._on('focus', bind(this, '_onFocus'));
		this._on('blur', bind(this, '_onBlur'));
		this.setText()
	}
	
	this.getValue = function() { return this._element.value; }
	this.focus = function() { this._element.focus(); }
	this.disable = function() { this._element.disabled = true }
	
	this._onFocus = function() {
		if (this._element.value != this._defaultText) { return; }
		if (this._isPassword) { this._element.type = 'password'; }
		this.removeClassName('defaultValue');
		this._element.value = '';
	}
	
	this._onBlur = function() {
		if (this._element.value != '' && this._element.value != this._defaultText) { return; }
		if (this._isPassword) { this._element.type = 'text'; }
		this.addClassName('defaultValue');
		this.setText(null, true)
	}
})