module.exports = {
	"User": {
		"name":        { id:1, type:"Text" },
		"tasks":       { id:2, type:"Set", of:"Task" }
	},
	"Task": {
		"title":       { id:1, type:"Text" },
		"labels":      { id:2, type:"Set", of:"TaskLabel" },
		"owner":       { id:3, type:"User" },
		"subscribers": { id:4, type:"Set", of:"User" },
		// "parent":      { id:5, type:"Task" },
		// "subTasks":    { id:6, type:"Set", of:"Task" },
		"due":         { id:7, type:"Number" },
		"description": { id:8, type:"Text" }
	},
	"TaskLabel": {
		"title":       { id:1, type:"Text" },
		"tasks":       { id:2, type:"Set", of:"Task" }
	},
	"Local": {
		"currentTaskID": { id:1, type:"Number" }
	}
}
