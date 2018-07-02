(function() {
	angular.module("hermine").factory("ProjectFactory", ["$http","$q", function($http,$q) {
		return {

		//get all projects
		getAllProjectsPromise: '',
		getAllProjects : function(refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();
			
			if(!this.getAllProjectsPromise || refreshData)
			{
				$.post("ajax/projects/getAllProjects",{}).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","ProjectList could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getAllProjectsPromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getAllProjectsPromise;
			},

			//get project by id
			getProjectByIdPromise: '',
			getProjectById : function(id,refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getProjectByIdPromise || refreshData)
				{
					var id = parseInt(id);
					$.post("ajax/projects/getProjectById",{projectId:id}).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Project could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getProjectByIdPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getProjectByIdPromise;
			},

			//get project by ReferenzKey
			getProjectByRefPromise: '',
			getProjectByRef : function(ref, refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getProjectByIdPromise || refreshData)
				{
					$.post("ajax/projects/getProjectByRef",{projectRef:ref}).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Project could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getProjectByRefPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getProjectByRefPromise;
			},
			
			//get all categories for a project
			getAllCategoriesForProjectPromise: '',
			getAllCategoriesForProject : function(id,refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();
			
			if(!this.getAllCategoriesForProjectPromise || refreshData)
			{
				$.post("ajax/projects/getAllCategoriesForProject",{projectId:id}).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","Categories could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getAllCategoriesForProjectPromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getAllCategoriesForProjectPromise;
			},

			//get all structureNodes for a project
			getAllStructureNodesForProjectPromise: '',
			getAllStructureNodesForProject : function(refKey, refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();
			
			if(!this.getAllStructureNodesForProjectPromise || refreshData)
			{
				$.post("ajax/projects/getAllStructureNodesForProject",{projectRef:refKey}).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","Structure nodes could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getAllStructureNodesForProjectPromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getAllStructureNodesForProjectPromise;
			},

		};
	}]);
})();