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
	angular.module("hermine").factory("UsersFactory", ["$http","$q", function($http,$q) {
		return {

			//get current users
			getCurrentUserPromise: '',
			getCurrentUser : function(refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getCurrentUserPromise || refreshData) {
					$http.get("ajax/auth/getUser").then(function successCallback(response) {
						deferred.resolve(response.data);
					}, function errorCallback(response) {
						BRUNCH.notify("error","Current user could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getCurrentUserPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getCurrentUserPromise;
			},

			//get current user from database
			getCurrentUserFromDBPromise: '',
			getCurrentUserFromDB : function(refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getCurrentUserFromDBPromise || refreshData) {
					$http.get("ajax/auth/getUserFromDB").then(function successCallback(response) {
						deferred.resolve(response.data);
					}, function errorCallback(response) {
						BRUNCH.notify("error","Current user could not be loaded from the database","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getCurrentUserFromDBPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getCurrentUserFromDBPromise;
			},

			//get all users
			getAllUsersPromise: '',
			getAllUsers : function(refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getAllUsersPromise || refreshData) {
					$http.get("ajax/auth/getFullUserList").then(function successCallback(response) {
						deferred.resolve(response.data);
					}, function errorCallback(response) {
						BRUNCH.notify("error","Users could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getAllUsersPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getAllUsersPromise;
			},
						
		};
	}]);
})();