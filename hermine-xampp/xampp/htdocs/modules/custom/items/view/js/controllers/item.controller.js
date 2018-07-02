(function() {
	angular.module("hermine").controller("ItemController", ["$scope","$http","ItemFactory","ngDialog","UsersFactory","ProjectFactory","$routeParams", function($scope,$http,ItemFactory,ngDialog,UsersFactory,ProjectFactory,$routeParams) {

		$scope.currentProject = {};
		$scope.allProjects = [];
		$scope.allItems = [];
		$scope.route = $routeParams.id;

		$scope.route = $routeParams.id;

		BRUNCH.showSpinner();
		if ($scope.route > 0)
		{
			ProjectFactory.getProjectById($scope.route,true).then(function(data) {
				$scope.currentProject	= data;

				ItemFactory.getAllItemsById($scope.currentProject.refKey, true).then(function(data) {
					$scope.allItems	= data;
				});
			});
		}
		else
		{
			ProjectFactory.getAllProjects(true).then(function(data) {
				$scope.allProjects	= data;
			});
		}

		BRUNCH.hideSpinner();

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
			BRUNCH.hideSpinner();
		});

		$scope.showNewItemDialog = function() {

			$scope.dialog = ngDialog.open({
				template:"modules/custom/items/view/uiElements/others/addItem.dialog.html",
				scope:$scope
			});
		};

		$scope.navigateTo	= function(projectId) {
			BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/overview/"+projectId);
		};

		$scope.navigateToDetail	= function(itemId) {
			BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/"+itemId);
		};
		
	}]);
})();