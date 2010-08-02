var util = exports

var _templates = {},
	_templateQueue = {}

util.withTemplate = function(templateName, callback) {
	var path = 'templates/' + templateName + '.html'
	if (_templates[path]) { 
		callback(_templates[path])
	} else if (_templateQueue[path]) {
		_templateQueue[path].push(callback)
	} else {
		_templateQueue[path] = [callback]
		client.xhr.get(path, function(template) {
			_templates[path] = template
			var cbs = _templateQueue[path]
			for (var i=0, cb; cb = cbs[i]; i++) {
				cb(template)
			}
		})
	}
}

util.createNewTask = function(params, callback) {
	params.type = 'task'
	params.user = gUserId
	params.done = false
	params.title = params.title || 'I need to...'
	params.date = fan.time.endOfDay(fin.now()).getTime()
	fin.create(params, callback)
}

util.createNewProject = function(callback) {
	fin.create({ type: 'project', done: false, }, callback)
}
