jsio('from common.javascript import Class');

jsio('import ui.Component');

exports = Class(ui.Component, function(supr) {
	
	this._domType = 'input'
	this._className = 'Input'
	
	this.init = function(defaultText, isPassword) {
		supr(this, 'init');
		this._defaultText = defaultText;
		this._isPassword = isPassword;
	}
	
	this._createContent = function() {
		this._element.type = this._isPassword ? 'password' : 'text';
		this._element.value = this._defaultText;
		this._on('focus', bind(this, '_onFocus'));
		this._on('blur', bind(this, '_onBlur'));
		this._onBlur();
	}
	
	this.getValue = function() { return this._element.value; }
	this.focus = function() { this._element.focus(); }
	this.disable = function() { this._element.disabled = true }
	
	this._onFocus = function() {
		if (this._element.value != this._defaultText) { return; }
		if (this._isPassword) { this._element.type = 'password'; }
		this._removeClassName('defaultValue');
		this._element.value = '';
	}
	
	this._onBlur = function() {
		if (this._element.value != '') { return; }
		if (this._isPassword) { this._element.type = 'text'; }
		this._addClassName('defaultValue');
		this._element.value = this._defaultText;
	}
})