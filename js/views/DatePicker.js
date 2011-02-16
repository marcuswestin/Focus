var ValueView = require('./Value'),
	time = require('../util').time,
	overlay = require('../ui/overlay')

module.exports = Class(ValueView, function(supr){
	
	this._className += ' DatePicker'
	this._days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
	this._monthOffset = 0
	
	this._createContent = function() {
		this._on('click', bind(this, '_showPicker'))
		fin.observe(this._itemId, this._property, bind(this, '_onDateChange'))
		this._makeFocusable()
	}
	
	this.handleKeyboardSelect = function() { this._showPicker() }
	
	this._onDateChange = function(mutation, newValue) {
		if (!this._timeString) { 
			this._timeString = new time.TimeString(newValue)
				.addClassName('content')
				.appendTo(this._element)
		}
		this._timestamp = newValue
		this._timeString.setTimestamp(this._timestamp)
		this._updatePicker()
		this._publish('Resize')
	}
	
	this._showPicker = function() {
		var layout = this.getLayout(),
			picker = this._getPicker()
		
		this
			.setStyle(picker, { position: 'absolute', background: 'white', border: '1px solid #333' })
			.layout(picker, { x: layout.x, y: layout.y + layout.h })
			._updatePicker()
		
		overlay.show(picker, true)
	}
	
	this._getPicker = function() {
		if (this._picker) { return this._picker }
		var picker = this._create({ className: 'DatePickerBody' }),
			header = this._create({ className: 'header', parent: picker }),
			prevMonth = this._create({ text: '<-', parent: header, className: 'prevMonth' }),
			clearMonth = this._create({ text: '...', parent: header, className: 'thisMonth' }),
			nextMonth = this._create({ text: '->', parent: header, className: 'nextMonth' }),
			clearBtn = this._create({ text: 'clear', parent: header, className: 'clearButton' }),
			table = this._create({ tag: 'table', parent: picker }),
			body = this._create({ tag: 'tbody', parent: table }),
			days = this._days,
			row, rowsCount = 5
		
		this._on(prevMonth, 'click', bind(this, '_changeMonthOffset', -1))
		this._on(nextMonth, 'click', bind(this, '_changeMonthOffset', 1))
		this._on(clearMonth, 'click', bind(this, '_clearMonthOffset'))
		this._on(clearBtn, 'click', bind(fin, 'set', this._itemId, this._property, null))
		
		var row = this._create({ tag: 'tr', parent: body })
		for (var i=0, day; day = days[i]; i++) {
			var th = this._create({ tag: 'th', parent: row })
			this._create({ tag: 'label', parent: th, text: day })
		}
		
		while (rowsCount-- > 0) {
			row = this._create({ tag: 'tr', parent: body })
			for (var i=0, day; day = days[i]; i++) {
				this._create({ tag: 'td', parent: row })
			}
		}
		this._delegateOn(picker, 'click', bind(this, '_onPickerClick'))
		return this._picker = picker
	}
	
	this._changeMonthOffset = function(deltaOffset) {
		this._monthOffset += deltaOffset
		this._updatePicker()
	}
	
	this._clearMonthOffset = function() {
		this._monthOffset = 0
		this._updatePicker()
	}
	
	this._updatePicker = function() {
		if (!this._picker) { return }
		var selected = this._timestamp,
			now = fin.now(),
			currentDate = new Date(selected || now)
		
		currentDate.setMonth(currentDate.getMonth() + this._monthOffset)
		
		var daysInMonth = time.daysInMonth(currentDate),
			firstDay = time.firstDayOfMonth(currentDate),
			cell, cells = this._picker.getElementsByTagName('td')
		
		for (var i=0; cell = cells[i]; i++) {
			cell.innerHTML = ''
			this
				.removeClassName(cell, 'selected')
				.removeClassName(cell, 'today')
		}
		
		currentDate = time.endOfDay(currentDate)
		for (var date=1; date <= daysInMonth - firstDay; date++) {
			cell = cells[firstDay + date - 1]
			cell.innerHTML = date
			currentDate.setDate(date)
			cell.delegateId = currentDate.getTime()
			var endOfDay = currentDate.getTime(),
				startOfDay = endOfDay - time.days + time.seconds
			
			this.toggleClassName(cell, 'selected', startOfDay <= selected && selected <= endOfDay)
			this.toggleClassName(cell, 'today', startOfDay <= now && now <= endOfDay)
		}
	}
	
	this._onPickerClick = function(timestamp) {
		fin.set(this._itemId, this._property, timestamp)
		overlay.hide()
	}
})