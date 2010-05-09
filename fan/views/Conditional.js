jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')

exports = Class(fan.views.Value, function(supr){
	
	this._className += ' Conditional'
	
	this.init = function(args) {
		supr(this, 'init', arguments)
		
		this._ifTrue = args[2]
		this._ifFalse = args[3]
		console.log("HERE", this._ifTrue, this._ifFalse, args)
	}
	
	this.setValue = function(value) {
		if (typeof value == 'undefined') { return }
		if (value) {
			this._element.innerHTML = this._ifTrue || ''
		} else {
			this._element.innerHTML = this._ifFalse || ''
		}
	}
})