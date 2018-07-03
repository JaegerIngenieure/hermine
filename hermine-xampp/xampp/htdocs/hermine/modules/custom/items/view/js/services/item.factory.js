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
	angular.module("hermine").factory("ItemFactory", ["$http","$q", function($http,$q) {
		return {

			//get all grid Combinations
			getAllGridCombinationsData: [],
			getAllGridCombinations : function (gridX, gridY) {
				BRUNCH.showSpinner();

				if (gridX === null || gridY === null)
				{
					BRUNCH.hideSpinner();
					return [];
				}

				var gridx = gridX.toUpperCase().charCodeAt(0);

				if (gridX.length > 1) 
				{
					var splitGridX = gridX.split("");
					for (var i = 65; i <= 90; ++i)
					{
						for (let y = 1; y <= gridY; y++)
						{
							this.getAllGridCombinationsData.push(String.fromCharCode(i) + y);
						}
					}

					for (var i = 65; i <= splitGridX[0].toUpperCase().charCodeAt(0); ++i)
					{
						if (String.fromCharCode(i) === splitGridX[0])
						{
							for (var x = 65; x <= splitGridX[1].toUpperCase().charCodeAt(0); x++)
							{
								for (let y = 1; y <= gridY; y++)
								{
									this.getAllGridCombinationsData.push(String.fromCharCode(i)+ String.fromCharCode(x) + y);
								}
								
							}
						}
						else
						{
							for (var x = 65; x <= 90; x++)
							{
								for (let y = 1; y <= gridY; y++)
								{
									this.getAllGridCombinationsData.push(String.fromCharCode(i)+ String.fromCharCode(x) + y);
								}
							
							}
						}
						
					}
				}
				else
				{
					for (var i = 65; i <= gridx; ++i)
					{
						for (let y = 1; y <= gridY; y++)
						{
							this.getAllGridCombinationsData.push(String.fromCharCode(i) + y);
						}
					}
				}
				
				BRUNCH.hideSpinner();
				return this.getAllGridCombinationsData;
			},


			//get all Items
			getAllItemsByIdPromise: '',
			getAllItemsById : function(id, refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getAllItemsByIdPromise || refreshData)
				{
					$.post("ajax/items/getAllItemsById",{projectRef:id}).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Items could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getAllItemsByIdPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getAllItemsByIdPromise;
			},

			//get Item by id
			getItemByIdPromise: '',
			getItemById : function(id,refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getItemByIdPromise || refreshData) {
					var id = parseInt(id);
					$.post("ajax/items/getItemById",{itemId:id}).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Item could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getItemByIdPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getItemByIdPromise;
			},


			//get history entries for item by id
			getHistoryEntriesForItemPromise: '',
			getHistoryEntriesForItem : function(id,refreshData) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getHistoryEntriesForItemPromise || refreshData) {
					$.post("ajax/items/getHistoryEntryForReferenceId",{scope:"item",refKey:id}).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","History entries could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getHistoryEntriesForItemPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getHistoryEntriesForItemPromise;
			},


			//get files for item
			getFilesForItemPromise: '',
			getFilesForItem : function(refreshData,moduleKey,targetDir) {
				BRUNCH.showSpinner();
				var deferred = $q.defer();
				if(!this.getFilesForItemPromise || refreshData) {
					var data = {
						moduleKey: moduleKey,
						targetDir: targetDir,
					};
					$.post("ajax/files/getFilesInDir",data).then(function successCallback(response) {
						deferred.resolve(JSON.parse(response));
					}, function errorCallback(response) {
						BRUNCH.notify("error","Files could not be loaded","The server responds with the following error message: '"+response.status+" "+response.statusText+"'");
					});
					this.getFilesForItemPromise = deferred.promise;
				}
				BRUNCH.hideSpinner();
				return this.getFilesForItemPromise;
			}

		};
	}]);
})();