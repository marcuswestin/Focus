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
	fin.create(params, function(itemId) {
		fin.addToSet(itemId, fan.keys.subscribers, gUserId)
		callback(itemId)
	})
}

util.createNewProject = function(callback) {
	fin.create({ type: 'project', done: false, }, callback)
}

var notifyNode,
	notifyInterval,
	notifyTimeout,
	notifyOpacity
util.notify = function(node) {
	clearInterval(notifyInterval)
	clearTimeout(notifyTimeout)
	
	if (!notifyNode) { 
		notifyNode = document.body.appendChild(document.createElement('div'))
		notifyNode.id = 'notifyNode'
	}
	notifyNode.innerHTML = ''
	notifyNode.style.opacity = 1
	notifyNode.appendChild(node)
	
	notifyTimeout = setTimeout(function() {
		notifyInterval = setInterval(function() {
			notifyNode.style.opacity -= .025
			if (notifyNode.style.opacity <= 0) {
				clearInterval(notifyInterval)
			}
		}, 50)
	}, 10000)
}
