import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-6',
  templateUrl: './post6.component.html',
})
export class BlogPost6Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  model = `demo.factory('TaskService', function() {
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
});`;

  view = `<!DOCTYPE html>
<html>
  <body>
    <div>
      <div ng-controller="TodoCtrl">
        <h3>To Do</h3>
        <button ng-click="load()">Reload</button>
        <ul>
          <li ng-repeat="task in tasks">
            <span>{{task.name}}</span>
            <button ng-click="update($index)">Start</button>
          </li>
        </ul>
      </div>
      <div ng-controller="InProgressCtrl">
        <h3>In Progress</h3>
        <button ng-click="load()">Reload</button>
        <ul>
          <li ng-repeat="task in tasks">
            <span>{{task.name}}</span>
            <button ng-click="update($index)">Complete</button>
          </li>
        </ul>
      </div>
      <div ng-controller="CompletedCtrl">
        <h3>Completed</h3>
        <button ng-click="load()">Reload</button>
        <ul>
          <li ng-repeat="task in tasks">
            <span>{{task.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <script src="https://code.angularjs.org/1.3.5/angular.js"></script>
    <script src="http://alanbuttars.com/assets/OpenQollo_5_controller.js"></script>
    <script src="http://alanbuttars.com/assets/OpenQollo_5_model.js"></script>
    <script type="text/javascript">
      angular.bootstrap(document.body, ['demo']);
    </script>
  </body>
</html>`;

  controller = `var demo = angular.module('demo', ['controllers']);
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
  $controller('TaskCtrl', { 
    $scope: $scope,
    TaskService: TaskService,
    taskType: "todo",
    nextTaskType: "inprogress",
  });
});

/* 3. InProgressCtrl for the "in progress" page */
controllers.controller('InProgressCtrl', function($controller, $scope, TaskService) {
  $controller('TaskCtrl', {
    $scope: $scope,
    TaskService: TaskService,
    taskType: "inprogress",
    nextTaskType: "completed",
  });
});

/* 4. CompletedCtrl for the "completed" page */
controllers.controller('CompletedCtrl', function($controller, $scope, TaskService) {
  $controller('TaskCtrl', {
    $scope: $scope,
    TaskService: TaskService,
    taskType: "completed",
    nextTaskType: null,
  });
});`;

}
