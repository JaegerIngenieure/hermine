(function() {
	angular.module("hermine").controller("AuthController", ["$scope", "$routeParams", "UsersFactory", "$filter", "$route", "$location", "ngDialog", function($scope,$routeParams,UsersFactory,$filter,$route,$location,ngDialog) {

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
		$scope.currentUser	= {};
		$scope.userRoles	= BRUNCH.customData.userRoles;
		$scope.dialog		= {};

		//get current user
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUserFromDB(true).then(function(currentUser) {
			//check for user permission and redirect depending on result
			if($filter("getPerms")(currentUser.permissions,"auth") >= 90) {
				//get all users
				BRUNCH.showSpinner();
				UsersFactory.getAllUsers(true).then(function(allUsers) {
					$scope.allUsers		= allUsers;
					//check if requested user exists
					if($scope.allUsers[$routeParams.id])
					{
						$scope.currentUser	= currentUser;
						$scope.user			= $scope.allUsers[$routeParams.id];
						$scope.user.isAdmin	= ($scope.user.isAdmin == "1") ? true : false;

					}
					else
					{
						//redirect to correct link
						BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/"+currentUser.userId);
					}					
					BRUNCH.hideSpinner();
				});
			} else {
				//check if user wants to access settings of himself
				if($routeParams.id == currentUser.userId)
				{
					$scope.currentUser	= currentUser;
					$scope.user			= currentUser;
					$scope.user.isAdmin	= ($scope.user.isAdmin == "1") ? true : false;

				} else {
					//redirect to correct link
					BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/"+currentUser.userId);
				}
			}			
			BRUNCH.hideSpinner();
		});

		//save data
		$scope.saveData	= function() {
			$scope.saveUserData();
		};

		//save user data
		$scope.saveUserData = function() {

			//collect data to save
			var isActive	= ($scope.user.isActive) ? "1" : "0";
			var isAdmin		= ($scope.user.isAdmin) ? "1" : "0";

			if($filter("getPerms")($scope.currentUser.permissions,"auth") >= 90)
			{
				var permissions	= {};
				angular.element("select.modulePerms").each(function() {
					var name	= angular.element(this).attr("name");
					var val		= angular.element(this).val();
					permissions[name] = val;
				});
			}
			else
			{
				var permissions = $scope.user.permissions;
			}

			var data = {
				personId:		$scope.user.personId,
				firstname:		$scope.user.firstname,
				lastname:		$scope.user.lastname,
				userId:			$scope.user.userId,
				username:		$scope.user.username,
				isActive:		isActive,
				isAdmin:		isAdmin,
				permissions:	permissions,
				defaultProject:	$scope.user.defaultProject
			};


			//check if new password is set
			if(
				$scope.user.newpass != "" &&
				typeof $scope.user.newpass != "undefined" &&
				angular.element("#newPassword").hasClass("ng-touched")
			) {
				if($scope.user.newpass == $scope.user.newpassconf) {
					//validate pw
					if(
						!/[^a-zA-Z0-9]/g.test($scope.user.newpass) || //check for non-alphanumberic chars
						!/[a-z]/g.test($scope.user.newpass) || //check for lowercase letters
						!/[A-Z]/g.test($scope.user.newpass) || //check for uppercase letters
						!/[0-9]/g.test($scope.user.newpass) || //check for numberic chars
						$scope.user.newpass.length < 8
					) {
						$scope.user.newpass = "";
						$scope.user.newpassconf = "";
						BRUNCH.notify("warning","New Password","Password needs to consist of at least eight lower- and upper-case characters including a special character and a number.");
					} else {
						data.password = hashGlobalPass($scope.user.newpass,$scope.user.username);
					}
				} else {
					$scope.user.newpass = "";
					$scope.user.newpassconf = "";
					BRUNCH.notify("warning","New Password","Passwords need to match.");
				}
			}

			//save data
			BRUNCH.showSpinner();
			$.post("ajax/auth/saveOrUpdateUser",data,function(response) {
				$scope.user.newpass = "";
				$scope.user.newpassconf = "";
				$scope.$apply();
				BRUNCH.hideSpinner();
				BRUNCH.notify("success","Successfully saved","New user information saved.");
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving user information: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};
		
		//delete User/Person
		$scope.deleteUser = function() {

			var data = {
				id:		$scope.user.personId
			};
			
			//delete User/Person
			BRUNCH.showSpinner();
			$.post("ajax/auth/removeUser",data,function(response) {
				
				BRUNCH.notify("success","Successfully deleted","User deleted.");
				setTimeout(function() {
					BRUNCH.navigateTo("/auth");
				},1200);
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting user: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};

	}]);
})();
