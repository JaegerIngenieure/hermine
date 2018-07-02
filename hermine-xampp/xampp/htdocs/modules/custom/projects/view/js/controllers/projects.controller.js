(function() {
	angular.module("hermine").controller("ProjectsController",["$scope", "ProjectFactory", "UsersFactory", "ngDialog", "Upload", function($scope,ProjectFactory,UsersFactory,ngDialog,Upload) {


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

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
			BRUNCH.hideSpinner();
		});

		$scope.detailRedirect = function (id) {
			BRUNCH.navigateTo("/projects#/detail/"+id);
		};

		//export whole project
        $scope.exportProject = function() {

            //execute export function
            $.post("ajax/projects/exportProject",{},function(response) {
                BRUNCH.notify("success","Export","Export has successfully been created.");
                window.open(response.url,"_blank");
            },"json").fail(function(response) {
                BRUNCH.notify("error","Error","An error occurred while creating the export: '"+response.responseText+"'");
            });
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