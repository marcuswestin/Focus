jsio.path.client = '../lib/fin/js'
jsio.path.shared = '../lib/fin/js'
jsio.path.fan = '../'

Meebo=function(){(Meebo._=Meebo._||[]).push(arguments)};
Meebo('domReady')

jsio('import client.fin') // makes fin globally accesible

window.gBody = document.body
window.gUserId = null
window.gUserIconUrl = null

jsio('import fan.views.Value')
jsio('import fan.views.Input')
jsio('import fan.views.Checkbox')
jsio('import fan.views.Conditional')
jsio('import fan.views.Editable')
jsio('import fan.views.ItemSetSelect')
jsio('import fan.views.Discussion')

fin.registerView('Value', fan.views.Value)
fin.registerView('Number', fan.views.Value) // TODO Create number view that only accepts number input
fin.registerView('Conditional', fan.views.Conditional)
fin.registerView('Input', fan.views.Input)
fin.registerView('Checkbox', fan.views.Checkbox)
fin.registerView('Editable', fan.views.Editable)
fin.registerView('ItemSetSelect', fan.views.ItemSetSelect)
fin.registerView('Discussion', fan.views.Discussion)

jsio('import fan.tasks.LoginManager')
jsio('import fan.tasks.KeyboardFocus')
jsio('import fan.tasks.panels.ListPanel')
jsio('import fan.tasks.panels.ItemPanel')
jsio('import fan.ui.overlay')
jsio('import fan.ui.resizeManager')

jsio('import client.xhr')

gUtil = {
	_templates: {},
	_templateQueue: {},
	withTemplate: function(itemType, viewType, callback) {
		var path = 'templates/' + itemType + '/' + viewType + '.html'
		if (gUtil._templates[path]) { 
			callback(gUtil._templates[path])
		} else if (gUtil._templateQueue[path]) {
			gUtil._templateQueue[path].push(callback)
		} else {
			gUtil._templateQueue[path] = [callback]
			client.xhr.get(path, function(template) {
				gUtil._templates[path] = template
				var cbs = gUtil._templateQueue[path]
				for (var i=0, cb; cb = cbs[i]; i++) {
					cb(template)
				}
			})
		}
	},
	createNewTask: function(params, callback) {
		params.type = 'task'
		params.user = gUserId
		params.done = false
		fin.create(params, callback)
	},
	createNewProject: function(callback) {
		fin.create({ type: 'project', done: false, }, callback)
	}
}

window.gLoginManager = new fan.tasks.LoginManager()

fin.registerEventHandler('FAN_AUTHENTICATION_DEMAND', function() {
	fan.ui.overlay.show(gLoginManager.getElement())
	gLoginManager.focus()
})

fin.registerEventHandler('FAN_AUTHENTICATION_RESPONSE', function(response) {
	if (response.authenticated) {
		gUserId = response.id
		fin.observe(gUserId, 'iconUrl', function(op, iconUrl) { gUserIconUrl = iconUrl })
		openApp()
	} else {
		alert("That didn't work.\n\n" + response.reason)
	}
})

gLoginManager.subscribe('Login', function(email, passwordHash){
	fin.send('FAN_AUTHENTICATION_REQUEST', { email: email, password_hash: passwordHash })
})

fin.connect(function(){
	window.gListPanel = new fan.tasks.panels.ListPanel()
	window.gItemPanel = new fan.tasks.panels.ItemPanel()
	window.gPanels = [gListPanel, gItemPanel]
	window.gKeyboardFocus = new fan.tasks.KeyboardFocus()
	
	gListPanel.subscribe('Resize', function(takenWidth) {
		var winSize = fan.ui.resizeManager.getWindowSize()
		takenWidth += 50
		gItemPanel.position(takenWidth, winSize.width - takenWidth)
	})
})

function openApp() {
	fan.ui.overlay.remove()

	if (openApp.initialized) { return }
	openApp.initialized = true
	
	// global sets
	// window.gProjects = []
	// window.gUsers = []
	// fin.query({ 'type': 'user' })
	// fin.query({ 'type': 'project' })
	
	gListPanel.appendTo(gBody)
	
	;(function initMeebo(q) {
		return
		var d=document,b=d.body,m=b.insertBefore(d.createElement('div'),b.firstChild),s=d.createElement('script');
		m.id='meebo';m.style.display='none';m.innerHTML='<iframe id="meebo-iframe"></iframe>';
		s.src='http'+(q.https?'s':'')+'://'+(q.stage?'stage-':'')+'cim.meebo.com/cim/cim.php?network='+q.network;
		b.insertBefore(s,b.firstChild);
	})({ network:'everywhere',stage:false })
	
	var items = [{ value: 'task', label: 'Create new Task' }, { value: 'project', label: 'Create new Project'}]
	Meebo('addButton', { type: 'menu', label: 'Create new ...', items: items, onSelect: function(value) {
		fin.create({ type: value }, function(item) {
			gItemPanel.setItem(item)
		})
	}})
}

