require('./globals')

var util = require('../lib/fin/api/fin/util')

var panels = require('./ui/panels')

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
})

fin.handle('authentication', function(data) {
	if (!data.uid) { throw 'could not log in' }
	global.user = new models.User(data.uid)
	
	global.panels = {
		left: new panels.LeftPanel(),
		center: new panels.CenterPanel(),
		right: new panels.RightPanel()
	}
	
	util.each(global.panels, function(panel) {
		panel.appendTo(document.body);
	})
})

fin.connect()
