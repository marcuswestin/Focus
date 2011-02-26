require('./globals')

var Button = require('./ui/Button')

models.process({
	"User": {
		"name":        { id:1, type:"Text" },
		"tasks":       { id:2, type:"Set", of:"Task" }
	},
	"Task": {
		"title":       { id:1, type:"Text" },
		"labels":      { id:2, type:"Set", of:"TaskLabel" },
		"owner":       { id:3, type:"User" },
		"subscribers": { id:4, type:"Set", of:"User" },
		// "parent":      { id:5, type:"Task" },
		// "subTasks":    { id:6, type:"Set", of:"Task" },
		"due":         { id:7, type:"Number" }
	},
	"TaskLabel": {
		"title":       { id:1, type:"Text" },
		"tasks":       { id:2, type:"Set", of:"Task" }
	}
})

fin.handle('authenticate', function() {
	fin.request('login', { uid:'marcus' })
	
	new Button('create new task')
		.appendTo(document.body)
		.subscribe('Click', this, function() {
			var task = new models.Task({ title:"Task", owner:global.user }).create()
			global.user.tasks.add(task)
		})
})

fin.handle('authentication', function(data) {
	if (!data.uid) { throw 'could not log in' }
	global.user = new models.User(data.uid)
	global.user.tasks.on('sadd', function(task) {
		task.owner.name.observe(function(name) { console.log('owner is', name) })
	})
})

fin.connect()
