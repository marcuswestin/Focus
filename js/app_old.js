require('./globals')

var LoginManager = require('./tasks/LoginManager'),
	KeyboardFocus = require('./tasks/KeyboardFocus'),
	ListPanel = require('./tasks/panels/ListPanel'),
	ItemPanel = require('./tasks/panels/ItemPanel'),
	info = require('./ui/info'),
	overlay = require('./ui/overlay'),
	resizeManager = require('./ui/resizeManager')

var query = require('./query')
	keys = require('./util').keys

window.gBody = document.body
window.gUserID = null
window.gUserIconUrl = null

// if (fan.ui.info.isTouch) {
// 	jsio('import fan.ui.touch')
// 	new fan.ui.touch.Body()
// }

window.gLoginManager = new LoginManager()

fin.handle('authenticate', function() {
	overlay.show(gLoginManager.getElement())
	fin.request('login', { uid:'marcus' })
})

fin.handle('authentication', function(data) {
	if (data.uid) {
		gUserID = data.uid
		fin.observe(gUserID, 'iconUrl', function(op, iconUrl) { gUserIconUrl = iconUrl })
		openApp()
	} else {
		alert('could not log in')
	}
})

fin.connect(function(){
	window.gListPanel = new ListPanel()
	window.gItemPanel = new ItemPanel()
	window.gPanels = [gListPanel, gItemPanel]
	window.gKeyboardFocus = new KeyboardFocus()
	
	gListPanel.subscribe('Resize', this, function(takenWidth) {
		var winSize = resizeManager.getWindowSize()
		takenWidth += 50
		gItemPanel.position(takenWidth, winSize.w - takenWidth)
	})
})

function openApp() {
	overlay.remove()

	if (openApp.initialized) { return }
	openApp.initialized = true
	
	// global sets
	// window.gProjects = []
	// window.gUsers = []
	// fin.query({ 'type': 'user' })
	// fin.query({ 'type': 'project' })
	
	gListPanel.appendTo(gBody)
	
	if (query.getHash()) {
		gItemPanel.viewTask(parseInt(query.getHash()))
	}
}

