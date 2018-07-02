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