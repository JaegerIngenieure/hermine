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
	angular.module("hermine").controller("ProjectsController",["$scope", "ProjectFactory", "UsersFactory", "ngDialog", "Upload", function($scope,ProjectFactory,UsersFactory,ngDialog,Upload) {

        //get current user
        $scope.currentUser = {};
        BRUNCH.showSpinner();
        UsersFactory.getCurrentUser(false).then(function(data) {
            $scope.currentUser = data;

            if ($scope.currentUser.defaultProject != "" && parseInt($scope.currentUser.permissions.items) < 90)
            {
                ProjectFactory.getProjectByRef($scope.currentUser.defaultProject, true).then(function(data) {
                    $scope.currentProject	= data;
                    BRUNCH.navigateTo("/projects#/detail/"+$scope.currentProject.Id);
                });
            }

            BRUNCH.hideSpinner();
        });

		//get all projects
		$scope.allProjects = [];
		BRUNCH.showSpinner();
		ProjectFactory.getAllProjects(false).then(function(data) {
			$scope.allProjects	= data;
			BRUNCH.hideSpinner();
		});

		$scope.showNewProjectDialog = function() {

			$scope.dialog = ngDialog.open({
				template:"modules/custom/projects/view/uiElements/others/addProject.dialog.html",
				scope:$scope
			});
		};

        $scope.detailRedirect = function (id) {
			BRUNCH.navigateTo("/projects#/detail/"+id);
		};

		//export whole project
        $scope.exportProject = function() {
            
            if ($scope.allProjects.length > 0)
            {
                //execute export function
                $.post("ajax/projects/exportProject",{},function(response) {
                    BRUNCH.notify("success","Export","Export has successfully been created.");
                    window.open(response.url,"_blank");
                },"json").fail(function(response) {
                    BRUNCH.notify("error","Error","An error occurred while creating the export: '"+response.responseText+"'");
                });    
            }
            else
            {
                BRUNCH.notify("error","Error","No projects are available.");
            }
            
        };

        //import whole project
        //watch for dropped files in importFile
        $scope.$watch("importFile", function () {
            $scope.uploadImportFile($scope.importFile);
        });

        //do import process
        $scope.uploadImportFile = function (file) {
            if (file) {
                BRUNCH.showSpinner();
                if (!file.$error) {
                    Upload.upload({
                        url: BRUNCH.config.pageRoot + '/ajax/projects/doImport',
                        data: {
                            file: file,
                        },
                    }).then(function (response) {
                        //check if return is success or...
                        if(response.data.status) {
                            BRUNCH.hideSpinner();
                            BRUNCH.notify("success","Successfully imported","Import successfull.");
                            window.location.reload();
                        } else {
                            //...error
                            BRUNCH.hideSpinner();
                            BRUNCH.notify("error","Error","An error occurred while uploading the file: '"+response.data+"'");
                        }
                    });
                }
            }
        };

	}]);
})();