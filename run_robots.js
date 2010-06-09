require('../lib/fin/lib/js.io/packages/jsio')

jsio.path.client = '../lib/fin/js'
jsio.path.shared = '../lib/fin/js'
jsio.path.tasks = '../js/'

jsio('import client.fin') // makes fin globally accesible

jsio('import tasks.robots.BurndownRobot')

fin.connect(function() {
	var burndownRobot = new tasks.robots.BurndownRobot()
})
