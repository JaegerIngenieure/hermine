(function() {
	angular.module("hermine").config(["$routeProvider", function($routeProvider) {
		$routeProvider

			.when("/", {
				redirectTo: "/overview"
			})

			.when("/overview", {
				templateUrl: "modules/custom/items/view/uiElements/overview/projects.html",
				controller: "ItemController",
				controllerAs: "itemCtrl"
			})

			.when("/overview/:id", {
				templateUrl: "modules/custom/items/view/uiElements/overview/items.html",
				controller: "ItemController",
				controllerAs: "itemCtrl"
			})
			
			.when("/detail/:id", {
				templateUrl: "modules/custom/items/view/uiElements/detail/index.html",
				controller: "ItemDetailController",
				controllerAs: "itemDetailCtrl"
			})
			
			//otherwise fallback
			.otherwise({redirectTo: "/overview"});
	}]);
})();
