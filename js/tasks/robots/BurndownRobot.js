jsio('from shared.javascript import Class, bind, forEach')

exports = Class(function() {
	
	this.init = function() {
		var allProjects = fin.getItemSet({ type: 'project' })
		allProjects.addDependant(bind(this, '_onProjectsChange'))
	}
	
	this._onProjectsChange = function(mutation) {
		
		forEach(mutation.add, this, function(projectId) {
			logger.log("New project", projectId)
			var tasks = fin.getItemSet({ type: 'task', done: false, project: projectId })
			tasks.sum('remaining_time', bind(this, '_onRemainingTimeChange', projectId))
		})
		
		forEach(mutation.remove, function(projectId) {
			logger.warn("TODO: Release item set and it's reduce", projectId)
		})
	}
	
	this._onRemainingTimeChange = function(projectId, mutation, newTimeRemaining) {
		logger.log("Remaining time changed", projectId, newTimeRemaining)
		var newHistoryItem = { timestamp: new Date().getTime(), remaining_time: newTimeRemaining }
		fin.getItem(projectId).mutate({ property: 'burndown_history', append: newHistoryItem })
	}
})