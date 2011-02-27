require('./globals')

var util = require('../lib/fin/api/fin/util'),
	panels = require('./ui/panels')

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
