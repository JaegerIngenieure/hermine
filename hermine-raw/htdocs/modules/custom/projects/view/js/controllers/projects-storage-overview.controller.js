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

(function() {
	angular.module("hermine").controller("ProjectsStorageOverviewController", ["$scope", "UsersFactory", "ProjectFactory", "$http", "$q", "$routeParams", "$location", "ngDialog", "$filter", "Upload", "$timeout", "$parse", "$sce", function($scope, UsersFactory, ProjectFactory, $http, $q, $routeParams, $location, ngDialog, $filter, Upload, $timeout, $parse, $sce) {

		$scope.currentProject				= {};
		$scope.forms						= {};
		$scope.project						= {};
		$scope.store						= {};
        $scope.storageOverview              = {};

		ProjectFactory.getProjectById($routeParams.id,true).then(function(data) {

			$scope.currentProject = data;

			$scope.project.id 		= $scope.currentProject.Id;
			$scope.project.name 	= $scope.currentProject.name;
			$scope.project.comment 	= $scope.currentProject.comment;
			$scope.project.gridX	= $scope.currentProject.gridX;
			$scope.project.gridY	= $scope.currentProject.gridY;

			BRUNCH.showSpinner();
			ProjectFactory.getAllCategoriesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.project.category = data;
				BRUNCH.hideSpinner();
			});

			BRUNCH.showSpinner();
			ProjectFactory.getAllStoragesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.project.storage = $filter("filterStorage")(data);				
				BRUNCH.hideSpinner();

                //storage overview
                BRUNCH.showSpinner();
                ProjectFactory.getItemsForStorage(decodeURI($routeParams.id2), true).then(function(data) {
                    //build data for overview
                    for(var k in $scope.project.storage) {
                        if($scope.project.storage.hasOwnProperty(k)) {

                            //save storage to view var
                            var currentStorage  = $scope.project.storage[k];
                            $scope.storageOverview = angular.copy(currentStorage);

                            //calculate possible storage places
                            var val1    = (parseInt(currentStorage.value1) > 0) ? parseInt(currentStorage.value1) : 1;
                            var val2    = (parseInt(currentStorage.value2) > 0) ? parseInt(currentStorage.value2) : 1;
                            var val3    = (parseInt(currentStorage.value3) > 0) ? parseInt(currentStorage.value3) : 1;
                            var val4    = (parseInt(currentStorage.value4) > 0) ? parseInt(currentStorage.value4) : 1;
                            $scope.storageOverview.maxStorage = val1 * val2 * val3 * val4;

                            //get all items for storage
                            $scope.storageOverview.items    = data;
                            $scope.storageOverview.stats     = {
                                "usedCount" : $scope.storageOverview.items.length,
                                "usedPcts" : Math.round((100 / $scope.storageOverview.maxStorage) * $scope.storageOverview.items.length * 100) / 100

                            }
                        }
                    }                    

                    BRUNCH.hideSpinner();
                });
			});
		});
	}]);
})();