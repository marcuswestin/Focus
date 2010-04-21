jsio('from shared.javascript import Class');
jsio('import client.UIComponent');
jsio('import client.itemFocus');

exports = Class(client.UIComponent, function(supr){
	
	this.init = function(label) {
		supr(this, 'init');
		this._label = label;
	}
	
	this.createContent = function() {
		this.addClassName('Label');
		this._element.innerHTML = this._label;
	}
	
	this.toString = function() { return this._label; }
})
