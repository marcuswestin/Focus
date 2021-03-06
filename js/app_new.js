require('./globals')

var util = require('../lib/fin/api/fin/util'),
	panels = require('./ui/panels'),
	resizeManager = require('./ui/resizeManager')

fin.handle('authenticate', function() {
	fin.request('login', { uid:'marcus' })
})

fin.handle('authentication', function(data) {
	if (!data.uid) { throw 'could not log in' }
	global.user = new models.User(data.uid)
	
	reflectCurrentTaskInHash()
	createPanels()
	resizeManager.onResize(layoutPanels)
})

fin.connect()

/* Misc
 ******/
function createPanels() {
	global.panels = {
		left: new panels.LeftPanel(),
		center: new panels.CenterPanel(),
		right: new panels.RightPanel()
	}
	util.each(global.panels, function(panel) {
		panel.appendTo(document.body)
		panel.subscribe('NewView', this, layoutPanels)
	})
}

function layoutPanels() {
	var winSize = resizeManager.getWindowSize(),
		margin = 10,
		left = margin
	util.each(global.panels, function(panel) {
		panel.setStyle({ left:left, top:margin })
		left += panel.resize(winSize.w - left, winSize.h - margin*2) + margin
	})
}

function reflectCurrentTaskInHash() {
	models.local.currentTaskID.observe(function(taskID) {
		if (!taskID) { return }
		window.location.hash = '#' + (taskID || '')
	})
	var taskID = window.location.hash.substr(1)
	if (taskID) { models.local.currentTaskID.set(parseInt(taskID)) }
}
