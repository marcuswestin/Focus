var Component = require('../ui/Component'),
	Input = require('../ui/Input'),
	Button = require('../ui/Button'),
	Link = require('../ui/Link'),
	sha1 = require('../sha1')

module.exports = Class(Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this._createContent = function() {
		var inputsEl = this._create({ className: 'inputs', parent: this._element })
		
		this._email = new Input("What's your user name?")
			.addClassName('email')
			.appendTo(inputsEl)
			.subscribe('Submit', this, '_submit')
		
		this._password = new Input("And what's your password?", true)
			.addClassName('password')
			.appendTo(inputsEl)
			.subscribe('Submit', this, '_submit')
		
		new Button("Login")
			.appendTo(this._element)
			.subscribe('Click', this, '_submit')
	}
	
	this.disable = function() {
		this._email.disable()
		this._password.disable()
	}
	this.enable = function() {
		this._email.enable()
		this._password.enable()
	}
	
	this._submit = function() {
		this._password.blur()
		this._email.blur()
		
		var email = this._email.getValue(),
			passwordHash = sha1(this._password.getValue())
		
		this._publish('Login', email, passwordHash)
	}
})