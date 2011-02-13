window.fin = require('./lib/fin/api/client')

var views = {
	Value: require('./fan/views/Value'),
	Input: require('./fan/views/Input'),
	Checkbox: require('./fan/views/Checkbox'),
	Conditional: require('./fan/views/Conditional'),
	Editable: require('./fan/views/Editable'),
	ItemSetSelect: require('./fan/views/ItemSetSelect'),
	DatePicker: require('./fan/views/DatePicker'),
	Discussion: require('./fan/views/Discussion')
}

var ViewFactory = require('./fan/ViewFactory')

ViewFactory.registerView('Value', views.Value)
ViewFactory.registerView('Number', views.Value) // TODO Create number view that only accepts number input
ViewFactory.registerView('Conditional', views.Conditional)
ViewFactory.registerView('Input', views.Input)
ViewFactory.registerView('Checkbox', views.Checkbox)
ViewFactory.registerView('Editable', views.Editable)
ViewFactory.registerView('ItemSetSelect', views.ItemSetSelect)
ViewFactory.registerView('DatePicker', views.DatePicker)
ViewFactory.registerView('Discussion', views.Discussion)

var LoginManager = require('./fan/tasks/LoginManager'),
	KeyboardFocus = require('./fan/tasks/KeyboardFocus'),
	ListPanel = require('./fan/tasks/panels/ListPanel'),
	ItemPanel = require('./fan/tasks/panels/ItemPanel'),
	info = require('./fan/ui/info'),
	overlay = require('./fan/ui/overlay'),
	resizeManager = require('./fan/ui/resizeManager')

var query = require('./fan/query')
	time = require('./fan/time'),
	keys = require('./fan/keys')

window.gBody = document.body
window.gUserId = null
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
		gUserId = data.uid
		fin.observe(gUserId, 'iconUrl', function(op, iconUrl) { gUserIconUrl = iconUrl })
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
		gItemPanel.viewTask(query.getHash())
	}
}

