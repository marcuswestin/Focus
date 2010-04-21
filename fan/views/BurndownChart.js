jsio('from shared.javascript import Class, bind')
jsio('import fan.views.Value')

exports = Class(fan.views.Value, function(supr) {
	
	this._className += ' BurndownChart'
	
	this._createContent = function() {
		this._chart = Raphael(this._element)
		// this._chart.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif"
		this._seen = {}
		this._values = []

		supr(this, '_createContent')
	}
	
	this._onItemMutation = function(mutation) {
		if (mutation.value) {
			// Hmmm - looks like the value passed through is the same array. Can't do appends to that without messing up state from the originating item. Should fix this in the item code
			this._values = Array.prototype.slice.call(mutation.value, 0)
		} else if (mutation.append) {
			if (this._seen[mutation.append.timestamp]) { return } 
			this._seen[mutation.append.timestamp] = true
			this._values.push(mutation.append)
		}
		this.draw()
	}
	
	this.draw = function() {
		var columns = [],
			values = []
		for (var i = 0, value; value = this._values[i]; i++) {
			if (!value.remaining_time) { continue }
			columns.push(value.timestamp)
			values.push(value.remaining_time)
		}
		
		this._chart.clear()
		this._chart.g.linechart(10, 10, 450, 220, columns, values);
	}
})