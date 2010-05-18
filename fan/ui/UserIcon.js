jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

// Do something like http://sexybuttons.googlecode.com/svn/trunk/index.html#
exports = Class(fan.ui.Component, function(supr) {
	
	this._className = 'UserIcon'
	this._domTag = 'span'
	
	this.init = function(userId) {
		supr(this, 'init')
		this._userId = userId
	}
	
	this._createContent = function() {
		this._img = this._create({ tag: 'img', parent: this._element })
		fin.observe(this._userId, 'iconUrl', bind(this, '_onIconUrlChange'))
	}
	
	this._onIconUrlChange = function(op, iconUrl) {
		if (!iconUrl) { return }
		this._img.src = iconUrl
	}
})