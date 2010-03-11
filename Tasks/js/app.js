jsio.path.browser = '../lib/fin/js'
jsio.path.common = '../lib/fin/js'
jsio.path.fan = '../js'
jsio.path.tasks = './js'

jsio('import browser.fin as fin')

jsio('import tasks.LoginManager')
jsio('import tasks.Drawer')

var gLoginManager = new tasks.LoginManager()
var gDrawer = new tasks.Drawer()

gLoginManager.appendTo(document.body)

fin.connect(function(){
	gLoginManager.onConnected()
})
