var time = module.exports = {}

var Component = require('../ui/Component')

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
		normalizedThen = new Date(then.getFullYear(), then.getMonth(), then.getDate()),
		normalizedTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
		diff = normalizedThen.getTime() - now,
		roundFn = diff < 0 ? Math.ceil : Math.floor,
		days = Math.ceil(diff / time.days),
		updateIn = normalizedTomorrow.getTime() - now.getTime()
	
	callback(days)
	if (!clearTimeoutId) { clearTimeoutId = unique() }
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
time.endOfDay = function(date) {
	if (typeof date == 'number') { date = new Date(date) }
	date.setHours(23)
	date.setMinutes(59)
	date.setSeconds(59)
	return date
}

time.TimeString = Class(Component, function(supr) {
	
	this._className = 'TimeString'
	this._domTag = 'span'
	
	this.init = function(timestamp) {
		supr(this, 'init')
		this._timestamp = timestamp
	}
	
	this.release = function() { clearTimeout(this._timeout) }
	this.setTimestamp = function(timestamp) {
		this.release()
		this._timestamp = timestamp
		this._update()
	}
	
	this._createContent = function() { this._update() }
	
	this._update = function() {
		if (!this._timestamp) {
			this._element.innerHTML = 'Date not set'
			this.release()
			return
		}
		var now = fin.now(),
			diff = now - this._timestamp,
			isFuture = diff < 0,
			roundFn = isFuture ? Math.ceil : Math.floor,
			weeks = roundFn(diff / time.weeks),
			days = roundFn(diff / time.days),
			hours = roundFn(diff / time.hours),
			minutes = roundFn(diff / time.minutes),
			seconds = roundFn(diff / time.seconds),
			timeStr = null,
			updateIn = null,
			pluralize = false,
			el = this._element
		
		if (weeks) {
			timeStr = Math.abs(weeks) + ' week'
			updateIn = diff - weeks * time.weeks
			pluralize = weeks
		} else if (days) {
			timeStr = Math.abs(days) + ' day'
			updateIn = diff - days * time.days
			pluralize = days
		} else if (hours) {
			timeStr = Math.abs(hours) + ' hour'
			updateIn = diff - hours * time.hours
			pluralize = hours
		} else if (minutes) {
			timeStr = Math.abs(minutes) + ' minute'
			updateIn = diff - minutes * time.minutes
			pluralize = minutes
		} else if (seconds > 20) {
			timeStr = 'less than a minute ago'
			updateIn = (60 - seconds) * time.seconds
		} else {
			timeStr = 'just now'
			updateIn = (20 - seconds) * time.seconds
		}
		
		if (pluralize) { el.innerHTML = timeStr + (Math.abs(pluralize) > 1 ? 's' : '') + ' ' + (isFuture ? 'from now' : 'ago') } 
		else { el.innerHTML = timeStr }
		
		this._timeout = setTimeout(bind(this, '_update'), Math.abs(updateIn))
	}
})