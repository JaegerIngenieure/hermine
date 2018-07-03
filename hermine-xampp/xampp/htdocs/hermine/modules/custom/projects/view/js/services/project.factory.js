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

			//get all storage for a project
			getAllStoragesForProjectPromise: '',
			getAllStoragesForProject : function(id,refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();
			
			if(!this.getAllStoragesForProjectPromise || refreshData)
			{
				$.post("ajax/projects/getAllStoragesForProject",{projectId:id}).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","Categories could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getAllStoragesForProjectPromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getAllStoragesForProjectPromise;
			},

			//get Items with Empty Fields for project
			getItemsWithEmptyFieldsPromise: '',
			getItemsWithEmptyFields : function(id,refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();
			
			if(!this.getItemsWithEmptyFieldsPromise || refreshData)
			{
				$.post("ajax/projects/getItemsWithEmptyFields",{projectId:id}).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","Categories could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getItemsWithEmptyFieldsPromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getItemsWithEmptyFieldsPromise;
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

            //get all items for storage
            getItemsForStoragePromise: '',
            getItemsForStorage : function(refKey, refreshData) {
                BRUNCH.showSpinner();
                var deferred = $q.defer();

                if(!this.getItemsForStoragePromise || refreshData)
                {
                    $.post("ajax/projects/getAllItemsForStorage",{storageName:refKey}).then(function successCallback(response) {
                        deferred.resolve(JSON.parse(response));
                    }, function errorCallback(response) {
                        BRUNCH.notify("error","Structure nodes could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
                    });
                    this.getItemsForStoragePromise = deferred.promise;
                }

                BRUNCH.hideSpinner();
                return this.getItemsForStoragePromise;
			},

			//get all items for storage
            getAllItemsByIdPromise: '',
            getAllItemsById : function(refKey, refreshData) {
                BRUNCH.showSpinner();
                var deferred = $q.defer();

                if(!this.getAllItemsByIdPromise || refreshData)
                {
                    $.post("ajax/projects/getAllItemsById",{projectRef:refKey}).then(function successCallback(response) {
                        deferred.resolve(JSON.parse(response));
                    }, function errorCallback(response) {
                        BRUNCH.notify("error","Structure nodes could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
                    });
                    this.getAllItemsByIdPromise = deferred.promise;
                }

                BRUNCH.hideSpinner();
                return this.getAllItemsByIdPromise;
			},
			
			//get files for item
			getFilesForProjectPromise: '',
			getFilesForProject : function(refreshData,moduleKey,targetDir) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getFilesForProjectPromise || refreshData) {
					var data = {
						moduleKey: moduleKey,
						targetDir: targetDir,
					};
					$.post("ajax/files/getFilesInDir",data).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Files could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getFilesForProjectPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getFilesForProjectPromise;
			},

			//get Items with Empty Fields for project
			getItemsWithUsedAttributePromise: '',
			getItemsWithUsedAttribute : function(ref,name,attribute,refreshData) {
			BRUNCH.showSpinner();
			var deferred = $q.defer();			
			if(!this.getItemsWithUsedAttributePromise || refreshData)
			{
				var data = {
					ref: ref,
					name: name,
					attribute: attribute
				};

				$.post("ajax/projects/getItemsWithUsedAttribute",data).then(function successCallback(response) {
					deferred.resolve(JSON.parse(response));
				}, function errorCallback(response) {
					BRUNCH.notify("error","Categories could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
				});
				this.getItemsWithUsedAttributePromise = deferred.promise;
			}
			
			BRUNCH.hideSpinner();
			return this.getItemsWithUsedAttributePromise;
			},

		};
	}]);
})();