jsio('from shared.javascript import Class, bind, forEach')
jsio('import fan.views.Value')
jsio('import fan.time')
jsio('import fan.ui.overlay')

exports = Class(fan.views.Value, function(supr){
	
	this._className += ' DatePicker'
	this._days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
	
	this._createContent = function() {
		this._on('click', bind(this, '_showPicker'))
		fin.observe(this._itemId, this._property, bind(this, '_onDateChange'))
		this._makeFocusable()
	}
	
	this.handleKeyboardSelect = function() { this._showPicker() }
	
	this._onDateChange = function(mutation, newValue) {
		if (!this._timeString) { 
			this._timeString = new fan.time.TimeString(newValue)
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
			.layout(picker, { x: layout.x, y: layout.y + layout.h, w: 100, h: 100 })
			._updatePicker()
		
		fan.ui.overlay.show(picker, true)
	}
	
	this._getPicker = function() {
		if (this._picker) { return this._picker }
		var picker = this._create({ tag: 'table', parent: this._element }),
			body = this._create({ tag: 'tbody', parent: picker }),
			days = this._days,
			row, rowsCount = 5
		
		row = this._create({ tag: 'tr', parent: body }),
		forEach(days, bind(this, function(day) {
			this._create({ tag: 'th', parent: row, text: day })
		}))
		
		while (rowsCount-- > 0) {
			row = this._create({ tag: 'tr', parent: body })
			forEach(days, bind(this, function(day) {
				this._create({ tag: 'td', parent: row })
			}))
		}
		this._delegateOn(picker, 'click', bind(this, '_onPickerClick'))
		return this._picker = picker
	}
	
	this._updatePicker = function() {
		if (!this._picker) { return }
		var selected = this._timestamp,
			now = fin.now(),
			currentDate = new Date(selected || now),
			daysInMonth = fan.time.daysInMonth(currentDate),
			firstDay = fan.time.firstDayOfMonth(currentDate),
			cell, cells = this._picker.getElementsByTagName('td')
		
		currentDate.setHours(0)
		currentDate.setMinutes(0)
		currentDate.setSeconds(0)
		for (var date=1; date <= daysInMonth; date++) {
			cell = cells[firstDay + date - 1]
			cell.innerHTML = date
			currentDate.setDate(date)
			cell.delegateId = currentDate.getTime()
			var startOfDay = currentDate.getTime(),
				endOfDay = startOfDay + fan.time.days
			
			this.toggleClassName(cell, 'selected', startOfDay <= selected && selected < endOfDay)
			this.toggleClassName(cell, 'today', startOfDay <= now && now < endOfDay)
			if (startOfDay <= now && now < endOfDay) {
				console.log(new Date(startOfDay), new Date(now), new Date(endOfDay))
			}
		}
	}
	
	this._onPickerClick = function(timestamp) {
		fin.set(this._itemId, this._property, timestamp)
		// fan.ui.overlay.hide()
	}
})