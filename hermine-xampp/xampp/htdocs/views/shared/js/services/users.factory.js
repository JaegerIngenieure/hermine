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