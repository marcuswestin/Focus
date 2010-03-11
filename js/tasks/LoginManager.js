jsio('from common.javascript import Class')
jsio('import ui.Component')
jsio('import ui.Input')

exports = Class(ui.Component, function(supr) {
	
	this._className = 'LoginManager'
	
	this._createContent = function() {
		this._email = new ui.Input("What's your email?")
		this._password = new ui.Input("What's your password?", true)
		
		this._email.appendTo(this._element)
		this._password.appendTo(this._element)
		
		this._on('keydown', bind(this, '_onKeyDown'))
		
		// while developing
		this._email._element.value = 'marcus@meebo-inc.com'
		this._password._element.value = '123123'
		setTimeout(bind(this._password, 'focus'), 100)
	}
	
	this._onKeyDown = function(e) {
		if (e.key != this.keys['enter']) { return }
		this._email.disable()
		this._password.disable()
		this._publish('Submit', this._email.getValue(), this._password.getValue())
	}
})