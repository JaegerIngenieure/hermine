(function() {
	angular.module("hermine").controller("ItemController", ["$scope","$http","ItemFactory","ngDialog","UsersFactory","ProjectFactory","$routeParams", function($scope,$http,ItemFactory,ngDialog,UsersFactory,ProjectFactory,$routeParams) {

/*
    hermine - heritage-expedition, rubble-management & intuitive nametag excavation
    Copyright © 2017 Webthinker <https://www.webthinker.de/> (Alexander Kunz, Patrick Werner, Tobias Grass)
    Concept by Jäger Ingenieure GmbH <https://www.jaeger-ingenieure.de/> (Kay-Michael Müller)
    Sponsored by the research initiative "ZukunftBau" <https://www.forschungsinitiative.de/> of the "Federal Institute for Research on Building, Urban Affairs and Spatial Development" <https://www.bbsr.bund.de/>
    You are not permitted to remove or edit this or any other copyright or licence information.

    This file is part of hermine.

    hermine is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation version 3 of the License.

    hermine is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU  Affero General Public License
    along with hermine.  If not, see <https://www.gnu.org/licenses/>. 
*/ 

		$scope.currentProject = {};
		$scope.allProjects = [];
		$scope.allItems = [];
		$scope.route = $routeParams.id;
		
		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(true).then(function(data) {
			$scope.currentUser = data;
			
			if($scope.route ==  undefined)
			{
				ProjectFactory.getAllProjects(true).then(function(data) {
					$scope.allProjects	= data;
					
					if ($scope.currentUser.defaultProject != "" && parseInt($scope.currentUser.permissions.items) < 90)
					{
						ProjectFactory.getProjectByRef($scope.currentUser.defaultProject, true).then(function(data) {
							$scope.currentProject	= data;
							BRUNCH.navigateTo("/items#/overview/"+$scope.currentProject.Id);
						});	
					}					
				});
			}
			BRUNCH.hideSpinner();
		});

		if ($scope.route > 0)
		{
			BRUNCH.showSpinner();
			ProjectFactory.getProjectById($scope.route,true).then(function(data) {
				$scope.currentProject	= data;

				ItemFactory.getAllItemsById($scope.currentProject.refKey, true).then(function(data) {
					$scope.allItems	= data;
				});
			});
			BRUNCH.hideSpinner();
		}		

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