(function() {
	angular.module("hermine").controller("AddItemDetailController", ["$scope","$http","$routeParams","UsersFactory","ProjectFactory","ItemFactory", function($scope,$http,$routeParams,UsersFactory,ProjectFactory,ItemFactory) {

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

		$scope.newItem 			= {};		
		$scope.currentHistory	= {};
		$scope.allItems = [];
		$scope.check = {};
		
		BRUNCH.showSpinner();											
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
					storage: "",
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