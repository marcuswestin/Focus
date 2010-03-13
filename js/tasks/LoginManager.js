jsio('from common.javascript import Class')
jsio('import ui.Component')
jsio('import ui.Input')
jsio('import ui.Button')
jsio('import ui.Link')

exports = Class(ui.Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this._createContent = function() {
		this._state = 'login'
		var inputs = this._create({ className: 'inputs', parent: this._element })

		this._email = new ui.Input("What's your email?")
		this._email.appendTo(inputs)
		this._email.addClassName('email')

		this._password = new ui.Input("And what's your password?", true)
		this._password.appendTo(inputs)
		this._password.addClassName('password')
		
		this._submitButton = new ui.Button("Login")
		this._submitButton.appendTo(this._element)
		this._submitButton.subscribe('Click', bind(this, '_submit'))

		this._createLink = new ui.Link("Create an account")
		this._createLink.appendTo(this._element)
		this._createLink.subscribe('Click', bind(this, '_toggleState'))
		
		this._on('keydown', bind(this, '_onKeyDown'))
		// 
		// // while developing
		this._email._element.value = 'marcus@meebo-inc.com'
		this._password._element.value = '123123'
	}
	
	this.focus = function() { this._email.focus() }
	
	this._toggleState = function() {
		if (this._state == 'create') {
			this._state = 'login'
			this._email.setText("So what's your email again...?")
			this._password.setText("And what's your password?")
			this._submitButton.setText("Login")
		} else if (this._state == 'login') {
			this._state = 'create'
			this._email.setText("What email do you want to use?")
			this._password.setText("And what password do you want?")
			this._submitButton.setText("Create account")
		}
	}
	
	this._onKeyDown = function(e) {
		if (e.key != this.keys['enter']) { return }
		this._submit()
	}
	
	this._submit = function() {
		this._email.disable()
		this._password.disable()
		if (this._state == 'create') {
			this._publish('Create', this._email.getValue(), this._password.getValue())
		} else {
			this._publish('Login', this._email.getValue(), this._password.getValue())
		}
	}
})