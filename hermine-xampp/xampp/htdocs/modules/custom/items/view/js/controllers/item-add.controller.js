(function() {
	angular.module("hermine").controller("AddItemController", ["$scope","$http","$routeParams","UsersFactory","ProjectFactory","ItemFactory", function($scope,$http,$routeParams,UsersFactory,ProjectFactory,ItemFactory) {

		$scope.newItem 			= {};
		$scope.route 			= $routeParams.id;
		$scope.currentProject 	= {};
		$scope.currentHistory	= {};
		$scope.allItems = [];
		$scope.check = {};
				
		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
			BRUNCH.hideSpinner();
		});
		
		BRUNCH.showSpinner();
		ProjectFactory.getProjectById($scope.route,true).then(function(data) {
			$scope.currentProject	= data;
									
			ItemFactory.getAllItemsById($scope.currentProject.refKey, true).then(function(data) {
				$scope.allItems	= data;
								
				$scope.checkForDuplicateItemName = function(name) {			
			
					var items = $scope.allItems;
					
					for(let i in items)
					{
						if(items.hasOwnProperty(i))
						{
							if (items[i].name == name)
							{
								$scope.check.nameAlreadyExists = true;
								return false;
							}							
						}
					}
					return true;
				};
			});
			
			BRUNCH.hideSpinner();
		});
				
		//create new Item
		$scope.saveOrUpdateItem = function() {

			if($scope.checkForDuplicateItemName($scope.newItem.name.replace(/ /g, "_")))
			{
				BRUNCH.showSpinner();
				var newItemData = {
					ID: 0,
					name: $scope.newItem.name.replace(/ /g, "_"),
					gridX: $scope.newItem.gridX,
					gridY: $scope.newItem.gridY,
					structure: "",
					category: "",
					comment: $scope.newItem.comment,
					creator: $scope.currentUser.fullname,
					storage: $scope.newItem.storage,
					projectRef: $scope.currentProject.refKey,
					refKey: BRUNCH.createGUID()
				};

				//save Item
				$.post("ajax/items/saveOrUpdateItem",newItemData,function(itemResponse) {

					BRUNCH.notify("success","Successfully saved","Item saved.");
					$scope.saveHistoryEntry(newItemData['refKey']);
					
					setTimeout(function(){
						BRUNCH.navigateTo("/items#/detail/"+itemResponse);
						$scope.dialog.close();
					}, 1000);
					BRUNCH.hideSpinner();
				},"json").fail(function(response) {
					BRUNCH.notify("error","Error","An error occurred while creating the item: '"+response.responseText+"'");
					BRUNCH.hideSpinner();
				});
			}
			else
			{
				$scope.check.nameAlreadyExists = true;
			}
		};
				
		$scope.saveHistoryEntry = function(refKey) {
		
			//create data
			var data = {};
			data.historyEntryId		= 0;
			data.reference			= refKey;
			data.scope				= "item";
			data.author				= $scope.currentUser.fullname;
			data.content			= $scope.currentUser.fullname + " created item: " + $scope.newItem.name;
									
			$.post("ajax/items/saveOrUpdateHistoryEntry",data,function(response) {

				BRUNCH.notify("success","Successfully saved","History entry saved.");
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving the history entry: '"+response.responseText+"'");
			});
			
		};
		
	}]);
})();