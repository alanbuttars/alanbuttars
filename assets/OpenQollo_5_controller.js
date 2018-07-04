var demo = angular.module('demo', ['controllers']);
var controllers = angular.module('controllers', []);

/* 1. The TaskCtrl is a basic loader of information */
controllers.controller('TaskCtrl', function($scope, TaskService, taskType, nextTaskType) {
	
	$scope.tasks = [];
	
	$scope.load = function() {
		$scope.tasks = TaskService.getTasks(taskType);
	};
	
	$scope.update = function(index) {
		$scope.tasks[index].type = nextTaskType;
		$scope.load();
	};
	
	$scope.load();
});

/* 2. TodoCtrl for the "todo" page */
controllers.controller('TodoCtrl', function($controller, $scope, TaskService) {
	$controller('TaskCtrl', { $scope: $scope, TaskService: TaskService, taskType: "todo", nextTaskType: "inprogress" });
});

/* 3. InProgressCtrl for the "in progress" page */
controllers.controller('InProgressCtrl', function($controller, $scope, TaskService) {
	$controller('TaskCtrl', { $scope: $scope, TaskService: TaskService, taskType: "inprogress", nextTaskType: "completed" });
});

/* 4. CompletedCtrl for the "completed" page */
controllers.controller('CompletedCtrl', function($controller, $scope, TaskService) {
	$controller('TaskCtrl', { $scope: $scope, TaskService: TaskService, taskType: "completed", nextTaskType: null });
});