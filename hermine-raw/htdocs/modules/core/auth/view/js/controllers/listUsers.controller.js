(function() {
	angular.module("hermine").controller("listUsersController", ["$scope","UsersFactory", "$filter", "ngDialog", function($scope,UsersFactory,$filter,ngDialog) {

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

		//set vars
		$scope.user			= {};
		$scope.allUsers		= {};
		$scope.newUser		= {};
		$scope.dialog		= {};

		//get current user
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.user				= data;			
			
			//check for user permission and redirect if on start page
			if($filter("getPerms")($scope.user.permissions,"auth") >= 90) {
				//get all users
				BRUNCH.showSpinner();
				UsersFactory.getAllUsers(false).then(function(allUsers) {
					$scope.allUsers				= allUsers;
					BRUNCH.hideSpinner();
				});
			} else {
				$scope.navigateTo($scope.user.userId);
			}
			BRUNCH.hideSpinner();
		});

		//navigate to detail user
		$scope.navigateTo	= function(userId) {
			BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/"+userId);
		};

		//add new user
		$scope.showCreateUserDialog = function() {
			$scope.newUser.pwCorrect = "";
			$scope.dialog = ngDialog.open({
				template:"modules/core/auth/view/uiElements/addUser.dialog.html",
				scope:$scope
			});
		};

		//save new user
		$scope.createUserLock = false;
		$scope.createUser = function() {

			//set lock if new user is saved
			if($scope.createUserLock) {
				return;
			} else {
				$scope.createUserLock = true;
			}

			//collect data
			var data = {
				personId:		0,
				firstname:		$scope.newUser.firstname,
				lastname:		$scope.newUser.lastname,
				userId:			0,
				username:		$scope.newUser.username,
				isActive:		($scope.newUser.isActive) ? "1" : "0",
				isAdmin:		($scope.newUser.isAdmin) ? "1" : "0",
				permissions:	{},
				password:		hashGlobalPass($scope.newUser.newpass,$scope.newUser.username)
			};

			//save data
			BRUNCH.showSpinner();
			$.post("ajax/auth/saveOrUpdateUser",data,function(response) {
				if(typeof response.userId == "number") {
					BRUNCH.notify("success","Create successfully","New user was saved. Redirecting.");
					setTimeout(function() {
						$scope.dialog.close();
						$scope.navigateTo(response.userId);
					},1500);
				} else {
					$scope.createUserLock = false;
					BRUNCH.notify("error","Error","An error occurred while creating new user: '"+response.responseText+"'");
				}
				BRUNCH.hideSpinner();
			},"json").fail(function(response) {
				$scope.createUserLock = false;
				BRUNCH.notify("error","Error","An error occurred while creating new user: '"+response.responseText+"'");
			});
		};

		/* ##### watchers ##### */
		//watch new user firstname and lastname
		$scope.$watch("newUser.firstname + newUser.lastname", function() {
			if($scope.newUser.firstname) {
				$scope.newUser.username = (($scope.newUser.firstname).substring(0,2)).toLowerCase();
			}
			if($scope.newUser.lastname) {
				$scope.newUser.username += (($scope.newUser.lastname).substring(0,2)).toLowerCase();
			}

		});
		//watch new pw and pw confirmation
		$scope.$watch("newUser.newpass + newUser.newpassconf", function() {
			if($scope.newUser.newpass == $scope.newUser.newpassconf) {
				$scope.newUser.pwCorrect = "true";
			} else {
				$scope.newUser.pwCorrect = "";
			}
		});

	}]);
})();