jsio('from shared.javascript import Class, bind, forEach')

module.exports = Class(function() {
	
	this.init = function() {
		fin.query({ type: 'project' }, bind(this, '_onProjectsChange'))
		this._subs = {}
	}
	
	this._onProjectsChange = function(mutation) {
		var projectId = (mutation.sadd || mutation.srem),
			query = { type: 'task', status: {op: '!=', value: 'done'}, project: projectId }

		if (mutation.sadd) {
			this._subs[projectId] = fin.sum(query, bind(this, '_onRemainingTimeChange'))
		}
		if (mutation.srem) {
			fin.release(this._subs[projectId])
		}
	}
	
	this._onRemainingTimeChange = function(projectId, mutation, newTimeRemaining) {
		logger.log("Remaining time changed", projectId, newTimeRemaining)
		var newHistoryItem = { timestamp: new Date().getTime(), remaining_time: newTimeRemaining }
		fin.mutate(projectId, { property: 'burndown_history', rpush: newHistoryItem })
		fin.getItem(projectId).mutate()
	}
})