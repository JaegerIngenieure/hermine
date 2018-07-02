(function() {
	angular.module("hermine").config(["$routeProvider", function($routeProvider) {
		$routeProvider

			//index page
			.when("/", {
				templateUrl: "ajax/auth/getHtmlForUserList",
				controller: "listUsersController",
				controllerAs: "listUsersCtrl"
			})

			//index page
			.when("/detail/:id", {
				templateUrl: "ajax/auth/getHtmlForEditUserSettings",
				controller: "AuthController",
				controllerAs: "authCtrl",
				reloadOnSearch: false
			})

			//otherwise fallback
			.otherwise({redirectTo: "/detail/0"});
	}]);
})();