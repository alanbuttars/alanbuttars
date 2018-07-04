demo.factory('TaskService', function() {
				
	var tasks = [
	    { type: "todo", name: "Task 1" },
	    { type: "todo", name: "Task 2" },
	    { type: "inprogress", name: "Task 3" },
	    { type: "inprogress", name: "Task 4" },
	    { type: "completed", name: "Task 5" },
	    { type: "completed", name: "Task 6" },
	];
				
	var getTasks = function(taskType) {
		var toReturn = [];
		for (var i = 0; i < tasks.length; i++) {
			var task = tasks[i];
			if (task.type == taskType) {
				toReturn.push(task);
			}
		}
		return toReturn;
	};
				
	return {
		getTasks : getTasks
	};
});