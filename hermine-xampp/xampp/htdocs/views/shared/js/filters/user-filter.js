(function() {

	//return specific permissions for user
	angular.module("hermine").filter("getPerms", function() {
		return function(permissionsObject,requestedPermission) {
			var returnValue = "";
			//iterate permissions object
			for(permName in permissionsObject) {
				if(permissionsObject.hasOwnProperty(permName)) {
					if(permName == requestedPermission) {
						returnValue = parseInt(permissionsObject[permName]);
						break;
					}
				}
			}
			return returnValue;
		};
	});

})();