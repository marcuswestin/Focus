require('../lib/fin/lib/js.io/packages/jsio')

jsio.path.browser = '../lib/fin/js'
jsio.path.common = '../lib/fin/js'
jsio.path.tasks = '../js/'

jsio('import browser.fin') // makes fin globally accesible

jsio('import tasks.robots.BurndownRobot')

fin.connect(function() {
	var burndownRobot = new tasks.robots.BurndownRobot()
})
