jsio('from shared.javascript import Class')
jsio('import fan.ui.Component')

exports = Class(fan.ui.Component, function(supr) {
	
	this.init = function(timestamp) {
		supr(this, 'init')
		this._timestamp = timestamp
	}
	
	this._seconds = 1000
	this._minutes = this._seconds * 60
	this._hours = this._minutes * 60
	this._days = this._hours * 24
	this._weeks = this._days * 7
	
	this._createContent = function() {
		this._update()
	}
	
	this._update = function() {
		var now = fin.now(),
			diff = now - this._timestamp,
			weeks = Math.floor(diff / this._weeks),
			days = Math.floor(diff / this._days),
			hours = Math.floor(diff / this._hours),
			minutes = Math.floor(diff / this._minutes),
			seconds = Math.floor(diff / this._seconds),
			timeStr = null,
			updateIn = null,
			pluralize = false
		
		if (weeks) {
			timeStr = weeks + ' week'
			updateIn = diff - weeks * this._weeks
			pluralize = weeks
		} else if (days) {
			timeStr = days + ' day'
			updateIn = diff - days * this._days
			pluralize = days
		} else if (hours) {
			timeStr = hours + ' hour'
			updateIn = diff - hours * this._hours
			pluralize = hours
		} else if (minutes) {
			timeStr = minutes + ' minute'
			updateIn = diff - minutes * this._minutes
			pluralize = minutes
		} else if (seconds > 20) {
			timeStr = 'less than a minute ago'
			updateIn = (60 - seconds) * this._seconds
		} else {
			timeStr = 'just now'
			updateIn = (20 - seconds) * this._seconds
		}
		
		if (pluralize) {
			this._element.innerHTML = timeStr + (pluralize > 1 ? 's' : '') + ' ago'
		} else {
			this._element.innerHTML = timeStr
		}
		setTimeout(bind(this, '_update'), updateIn)
	}
})