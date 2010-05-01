jsio('from shared.javascript import Class')
jsio('import fan.sha1')
jsio('import fan.ui.Component')
jsio('import fan.ui.Input')
jsio('import fan.ui.Button')
jsio('import fan.ui.Link')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this._createContent = function() {
		this._state = 'login'
		var inputs = this._create({ className: 'inputs', parent: this._element })
		
		this._email = new fan.ui.Input("What's your email?")
		this._email.appendTo(inputs)
		this._email.addClassName('email')
		
		this._password = new fan.ui.Input("And what's your password?", true)
		this._password.appendTo(inputs)
		this._password.addClassName('password')
		
		this._submitButton = new fan.ui.Button("Login")
		this._submitButton.appendTo(this._element)
		this._submitButton.subscribe('Click', bind(this, '_submit'))
		
		this._on('keydown', bind(this, '_onKeyDown'))
		
		// // while developing
		this._email._element.value = 'marcus@meebo-inc.com'
		this._password._element.value = '123123'
	}
	
	this.focus = function() { this._email.focus() }
	
	this._onKeyDown = function(e) {
		if (e.keyCode != this.keys['enter']) { return }
		this._submit()
	}
	
	this._submit = function() {
		var email = this._email.getValue(),
			passwordHash = fan.sha1(this._password.getValue())
		
		this._email.disable()
		this._password.disable()
		this._publish('Login', email, passwordHash)
	}
})