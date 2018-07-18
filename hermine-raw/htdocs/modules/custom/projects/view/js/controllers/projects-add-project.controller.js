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
	angular.module("hermine").controller("AddProjectController", ["$scope","$http", "UsersFactory", function($scope,$http,UsersFactory) {

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
		});
		BRUNCH.hideSpinner();

		//create new project
		$scope.createNewProject = function() {

			var newProjectData = {
				name: $scope.newProject.name,
				comment: $scope.newProject.comment,
				refKey: $scope.newProject.name.replace(/ /g, '')+BRUNCH.createGUID()
			};
									
			$.post("ajax/projects/createnewProject",newProjectData,function(response) {

				BRUNCH.notify("success","Create successfully","Project created.");
				setTimeout(function(){
					
					BRUNCH.navigateTo("./projects");
					
				}, 800);
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while creating the project: '"+response.responseText+"'");
			});
		};
		
	}]);
})();