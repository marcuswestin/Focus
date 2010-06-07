jsio('from shared.javascript import Class, bind')
jsio('import fan.ui.Component')

var time = exports

time.seconds = 1000
time.minutes = time.seconds * 60
time.hours = time.minutes * 60
time.days = time.hours * 24
time.weeks = time.days * 7

var offsetTimeouts = {}
time.getDayOffset = function(timestamp, callback, clearTimeoutId) {
	if (!timestamp) {
		callback(null)
		return
	}
	
	var then = new Date(timestamp),
		now = new Date(fin.now()),
		normalizedThen = new Date(then.getYear(), then.getMonth(), then.getDate()),
		normalizedNow = new Date(now.getYear(), now.getMonth(), now.getDate())
	
	var diff = normalizedThen.getTime() - normalizedNow.getTime(),
		days = Math.floor(diff / time.days),
		updateIn = diff - days * time.days
	
	callback(days)
	
	if (!clearTimeoutId) { clearTimeoutId = fin.unique() }
	offsetTimeouts[clearTimeoutId] = setTimeout(bind(time, 'getDayOffset', timestamp, callback, clearTimeoutId), updateIn)
	
	return function() { clearTimeout(offsetTimeouts[clearTimeoutId]) }
}

time.daysInMonth = function (date) {
	if (typeof date == 'number') { date = new Date(date) }
	return new Date(date.getYear(), date.getMonth() + 1, 0).getDate()
}
time.firstDayOfMonth = function (date) {
	date = new Date(date)
	date.setDate(1)
	return date.getDay()
}


time.TimeString = Class(fan.ui.Component, function(supr) {
	
	this._className = 'TimeString'
	
	this.init = function(timestamp) {
		supr(this, 'init')
		this._timestamp = timestamp
	}
	
	this._createContent = function() { this._update() }
	
	this._update = function() {
		var now = fin.now(),
			diff = now - this._timestamp,
			weeks = Math.floor(diff / time.weeks),
			days = Math.floor(diff / time.days),
			hours = Math.floor(diff / time.hours),
			minutes = Math.floor(diff / time.minutes),
			seconds = Math.floor(diff / time.seconds),
			timeStr = null,
			updateIn = null,
			pluralize = false,
			el = this._element
		
		if (weeks) {
			timeStr = weeks + ' week'
			updateIn = diff - weeks * time.weeks
			pluralize = weeks
		} else if (days) {
			timeStr = days + ' day'
			updateIn = diff - days * time.days
			pluralize = days
		} else if (hours) {
			timeStr = hours + ' hour'
			updateIn = diff - hours * time.hours
			pluralize = hours
		} else if (minutes) {
			timeStr = minutes + ' minute'
			updateIn = diff - minutes * time.minutes
			pluralize = minutes
		} else if (seconds > 20) {
			timeStr = 'less than a minute ago'
			updateIn = (60 - seconds) * time.seconds
		} else {
			timeStr = 'just now'
			updateIn = (20 - seconds) * time.seconds
		}
		
		if (pluralize) { el.innerHTML = timeStr + (pluralize > 1 ? 's' : '') + ' ago' } 
		else { el.innerHTML = timeStr }
		
		setTimeout(bind(this, '_update'), updateIn)
	}
})