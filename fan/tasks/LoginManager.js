jsio('from shared.javascript import Class')
jsio('import fan.sha1')
jsio('import fan.ui.Component')
jsio('import fan.ui.Input')
jsio('import fan.ui.Button')
jsio('import fan.ui.Link')

exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this._createContent = function() {
		var inputsEl = this._create({ className: 'inputs', parent: this._element })
		
		this._email = new fan.ui.Input("What's your email?")
			.addClassName('email')
			.appendTo(inputsEl)
			.subscribe('Submit', this, '_submit')
		
		this._password = new fan.ui.Input("And what's your password?", true)
			.addClassName('password')
			.appendTo(inputsEl)
			.subscribe('Submit', this, '_submit')
		
		new fan.ui.Button("Login")
			.appendTo(this._element)
			.subscribe('Click', this, '_submit')
		
		// // while developing
		this._email._element.value = 'marcus@meebo-inc.com'
		this._password._element.value = '123123'
	}
	
	this.focus = function() { this._email.focus() }
	
	this._submit = function() {
		this._password.blur()
		this._email.blur()
		
		var email = this._email.getValue(),
			passwordHash = fan.sha1(this._password.getValue())
		
		this._email.disable()
		this._password.disable()
		this._publish('Login', email, passwordHash)
	}
})