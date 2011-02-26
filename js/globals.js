// Knowingly expose all of these globally...
global.fin = require('../lib/fin/api/client')

global.models = require('../lib/fin/api/models')

global.log = global.console ? function() { console.log.apply(console, arguments) } : function(){}

global.bind = function (context, method/*, args... */) {
	if (!context || !method || (typeof method == 'string' && !context[method])) { throw "bad bind arguments" }
	var curryArgs = Array.prototype.slice.call(arguments, 2)
	return function() {
		fn = (typeof method == 'string' ? context[method] : method)
		return fn.apply(context, curryArgs.concat(Array.prototype.slice.call(arguments, 0)))
	}
}

global.Class = function(parent, proto) {
	if(!proto) { proto = parent }
	proto.prototype = parent.prototype
	
	var cls = function() { if(this.init) { this.init.apply(this, arguments) }}
	cls.prototype = new proto(function(context, method, args) {
		var target = parent
		while(target = target.prototype) {
			if(target[method]) {
				return target[method].apply(context, args || [])
			}
		}
		throw new Error('supr: parent method ' + method + ' does not exist')
	})
	
	// Sometimes you want a method that renders UI to only execute once if it's called 
	// multiple times within a short time period. Delayed methods do just that
	cls.prototype.createDelayedMethod = function(methodName, fn) {
		// "this" is the class
		this[methodName] = function() {
			// now "this" is the instance. Each instance gets its own function
			var executionTimeout
			this[methodName] = bind(this, function() {
				clearTimeout(executionTimeout)
				executionTimeout = setTimeout(bind(fn, 'apply', this, arguments), 10)
			})
			this[methodName].apply(this, arguments)
		}
	}
	
	cls.prototype.constructor = cls
	return cls
}

Class.Singleton = function(parent, proto) {
	return new (Class(parent, proto))()
}

;(function(){
	__unique = 1
	global.unique = function() { return __unique++ }
})()
