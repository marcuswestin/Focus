var Component = require('./Component')

module.exports = Class(Component, function(supr){
	
	this._className = 'TextView'
	
	this.init = function(property) {
		supr(this, 'init')
		this._property = property
	}
	
	this._createContent = function() {
		this._content = this._create({ tag: this._valueTag, className: 'content', parent: this._element })
		this._property.observe(bind(this, 'setValue'))
	}
	
	this.setValue = function(value) {
		this._value = value || ''
		if (value) {
			value = value.toString().replace(/\n/g, '<br />')
			value = value.replace(/ $/, '&nbsp;')
		}
		this._content.innerHTML = value
	}
	
	this.release = function() {
		log("TODO implement release of views")
		return this
	}
})
