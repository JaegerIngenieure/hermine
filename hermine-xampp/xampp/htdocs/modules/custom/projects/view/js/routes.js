(function() {
	angular.module("hermine").config(["$routeProvider", function($routeProvider) {
		$routeProvider

			//project module
			.when("/", {
				redirectTo: "/overview"
			})

			.when("/overview", {
				templateUrl: "ajax/projects/getOverviewForProjects",
				controller: "ProjectsController",
				controllerAs: "projectsCtrl"
			})

			.when("/detail/:id", {
				templateUrl: "modules/custom/projects/view/uiElements/detail/index.html",
				controller: "ProjectsDetailController",
				controllerAs: "projectsDetailCtrl",
				reloadOnSearch: false
			})

			//otherwise fallback
			.otherwise({redirectTo: "/overview"});
	}]);
})();