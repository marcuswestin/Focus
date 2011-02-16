var Class = require('./Class')

module.exports = Class.Singleton(function() {
	
	this.init = function() {
		this._viewConstructors = {}
	}
	
	this.registerView = function(viewName, viewConstructor) {
		this._viewConstructors[viewName] = viewConstructor
	}
	
	this.createView = function(viewName, jsArgs, templateArgs) {
		var args = jsArgs
		if (templateArgs) { args = args.concat(templateArgs) }
		return new this._viewConstructors[viewName](args, jsArgs, templateArgs)
	}
})

