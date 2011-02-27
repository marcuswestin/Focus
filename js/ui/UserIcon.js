jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
module.exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'UserIcon'
	this._domTag = 'span'
	
	this._initialize = function(userId) {
		supr(this, '_initialize')
		this._userId = userId
	}
	
	this._createContent = function() {
		this._img = this._create({ tag: 'img', parent: this._element, src: gUserIconUrl })
		fin.observe(this._userId, 'iconUrl', bind(this, '_onIconUrlChange'))
	}
	
	this._onIconUrlChange = function(op, iconUrl) {
		var img = this._img
		if (!iconUrl || iconUrl == img.src.iconUrl) { return }
		img.src = iconUrl
	}
})