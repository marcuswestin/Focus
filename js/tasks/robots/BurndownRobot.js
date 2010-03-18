jsio('from common.javascript import Class, bind')

exports = Class(function() {
	
	this.init = function() {
		var allProjects = fin.getItemSet({ type: 'project' })
		allProjects.addDependant(bind(this, '_onProjectsChange'))
	}
	
	this._onProjectsChange = function(mutation) {
		
		if (mutation.add) {
			var projectId = mutation.add
			
			var taskSet = fin.getItemSet({ type: 'task', status: 'incomplete', project: projectId })
			taskSet.reduce({ sum: 'estimated_time' }, bind(this, '_onRemainingTimeChange', projectId))
		}
		
		if (mutation.remove) {
			logger.warn("TODO: Release item set and it's reduce")
		}
	}
	
	this._onRemainingTimeChange = function(projectId, newTimeRemaining) {
		var newHistoryItem = { timestamp: new Date().getTime(), timeRemaining: newTimeRemaining }
		fin.getItem(projectId).mutate({ property: 'burndownHistory', append: newHistoryItem })
	}

})