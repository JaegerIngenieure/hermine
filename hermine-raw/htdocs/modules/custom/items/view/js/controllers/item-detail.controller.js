(function() {
	angular.module("hermine").controller("ItemDetailController", ["$scope","UsersFactory","ItemFactory","$routeParams","ngDialog","Upload","$timeout","ProjectFactory","$filter", function($scope, UsersFactory, ItemFactory, $routeParams, ngDialog, Upload, $timeout, ProjectFactory, $filter) {

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

		$scope.files = [];
		$scope.route = $routeParams.id;
		$scope.currentHistory			= {};
		$scope.currentItem				= {};
		$scope.currentItem.storage		= {};
		$scope.newStorage				= {};


		$scope.frontendObject = {};
		//$scope.currentItem.frontendObject.storage = [];
		
		//set helper vars
		$scope.helpers					= {};

		//get current Item
		$scope.currentItem = {};
		$scope.currentItemOld = {};
		BRUNCH.showSpinner();
		ItemFactory.getItemById($scope.route,true).then(function(data) {
			$scope.currentItem = data;
			$scope.currentItemOld = angular.copy(data);			
			
			BRUNCH.hideSpinner();
			
			BRUNCH.showSpinner();
			ProjectFactory.getProjectByRef($scope.currentItem.projectRef ,true).then(function(data) {
			$scope.currentProject	= data;
			BRUNCH.hideSpinner();
							
				//get all grid Combinations
				$scope.gridCombinations = [];
				BRUNCH.showSpinner();
				$scope.gridCombinations = ItemFactory.getAllGridCombinations($scope.currentProject.gridX, $scope.currentProject.gridY);
				BRUNCH.hideSpinner();

				$scope.category = [];
				BRUNCH.showSpinner();
				ProjectFactory.getAllCategoriesForProject($scope.currentProject.refKey,true).then(function(data) {
					$scope.category = data;				
					$scope.category = $filter("filterCategoriesActive")($scope.category, $scope.currentItem.category);
					BRUNCH.hideSpinner();
				});

				$scope.storage = [];
				BRUNCH.showSpinner();
				ProjectFactory.getAllStoragesForProject($scope.currentProject.refKey, true).then(function(data) {
					$scope.storage = $filter("filterStorage")(data);
					$scope.frontendObject.storage = $filter("filterStorageforFrontend")($scope.storage, $scope.currentItem.storage);
					console.log("$scope.frontendObject.storage");
                    console.log($scope.frontendObject.storage);

					BRUNCH.hideSpinner();
				});				
								
				//get files for Item
				BRUNCH.showSpinner();
				ItemFactory.getFilesForItem(true,"item", $scope.currentProject.name +"/"+ $scope.currentItem.name + "/files/").then(function(data) {
					$scope.files = data;
					BRUNCH.hideSpinner();
				});
				
				//get picture for Item
				//$scope.files = [];
				BRUNCH.showSpinner();
				ItemFactory.getFilesForItem(true,"item", $scope.currentProject.name +"/"+ $scope.currentItem.name + "/images/").then(function(data) {

					if(data[0])
					{
						$scope.profileImage = data[0].path;
					}
					else
					{
						$scope.profileImage = false;
					}
					BRUNCH.hideSpinner();
				});

				$scope.structureData = [];
				BRUNCH.showSpinner();
				ProjectFactory.getAllStructureNodesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.structureData = data;
				BRUNCH.hideSpinner();
								
				$scope.data = $filter("filterForStructure")($scope.structureData);
				$scope.structureDropdown = $filter("filterForDropdown")($scope.data);
				
			});

			});

			//get history entries for item
			$scope.histories = [];
			BRUNCH.showSpinner();
			ItemFactory.getHistoryEntriesForItem($scope.currentItem.refKey,true).then(function(data) {
				$scope.histories = data;
				BRUNCH.hideSpinner();
			});
		});

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
			BRUNCH.hideSpinner();
		});

		$scope.setGridXValue = function (newGridX)
		{
			$scope.currentItem.gridX = newGridX;
			$scope.searchText = "";
		};

		$scope.setStorageValue = function (selection, newVal)
		{
			switch (selection)
			{
				case 1:

					$scope.frontendObject.storage.selected.value1 = newVal;
					$scope.storageVal1 = "";					
					break;

				case 2:

					$scope.frontendObject.storage.selected.value2 = newVal;
					$scope.storageVal2 = "";					
					break;

				case 3:

					$scope.frontendObject.storage.selected.value3 = newVal;
					$scope.storageVal3 = "";					
					break;

				case 4:

					$scope.frontendObject.storage.selected.value4 = newVal;
					$scope.storageVal4 = "";					
					break;
			
				default:
					break;
			}
		};

		$scope.saveOrUpdateItem = function() {

			BRUNCH.showSpinner();
			
			if($scope.frontendObject.storage.selected != undefined)
			{
				$scope.newStorage.name 		= $scope.frontendObject.storage.temp.name;
				$scope.newStorage.value1 	= $scope.frontendObject.storage.selected.value1; 
				$scope.newStorage.value2 	= $scope.frontendObject.storage.selected.value2;
				$scope.newStorage.value3 	= $scope.frontendObject.storage.selected.value3;
				$scope.newStorage.value4 	= $scope.frontendObject.storage.selected.value4;
				$scope.currentItem.storage 	= $scope.newStorage;

                if($scope.newStorage.name === "not stored")
                {
                    $scope.newStorage.value1 = 0;
                    $scope.newStorage.value2 = 0;
                    $scope.newStorage.value3 = 0;
                    $scope.newStorage.value4 = 0;
                }
			}
			else
			{
				$scope.newStorage.value1 = 0;  
				$scope.newStorage.value2 = 0; 
				$scope.newStorage.value3 = 0; 
				$scope.newStorage.value4 = 0;
			}

			var data = {
				ID: $scope.currentItem.ID,
				name: $scope.currentItem.name.replace(/ /g, "_"),
				gridX: $scope.currentItem.gridX,
				gridY: $scope.currentItem.gridY,
				structure: $scope.currentItem.structure,
				category: $scope.getActiveCategories(),
				comment: $scope.currentItem.comment,
				storage: JSON.stringify($scope.newStorage),
				projectRef: $scope.currentItem.refKey,
				refKey: $scope.currentItem.refKey
			};			
						
			$.post("ajax/items/checkItemName",data,function(response)
			{
				if(response.existing)
				{
					BRUNCH.notify("error","Error","Item name already exists.");
					BRUNCH.hideSpinner();
				}
				else
				{
					$.post("ajax/items/saveOrUpdateItem",data,function(response) {
						BRUNCH.notify("success","Successfully saved","Item was saved.");
		
						$scope.saveHistoryforChangedData($scope.currentItemOld, $scope.currentItem);
		
						setTimeout(function(){
							location.reload();
							BRUNCH.hideSpinner();
						}, 1000);
						
					},"json").fail(function(response) {
						BRUNCH.notify("error","Error","An error occurred while saving the item: '"+response.responseText+"'");
						BRUNCH.hideSpinner();
					});
				}
				
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","Item name already exists.");
				BRUNCH.hideSpinner();
			});			
		};

		$scope.addAdditionalInput = function(areaId,inputType,inputClass) {
			switch(inputType) {
				case "text":
					var inputTemplate = '<input type="'+inputType+'" name="additionalInput" class="form-control '+inputClass+'" />';
				break;

				case "textarea":
					var inputTemplate = '<textarea name="additionalInput" class="form-control '+inputClass+'" ></textarea>';
				break;
			}
			angular.element("#"+areaId).append(inputTemplate);
		};

		$scope.getActiveCategories = function () {
			
			var result = document.getElementsByClassName("btn-active");
			var wrappedResult = angular.element(result);
			let activeCategories = "";

			for (const i in wrappedResult)
			{
				if (wrappedResult.hasOwnProperty(i))
				{
					if (wrappedResult[i].innerText != undefined)
					{
						activeCategories += wrappedResult[i].innerText+"#";
					}					
				}
			}
			
			return activeCategories.slice(0, -1);
		};

		$scope.saveHistoryEntry = function(content) {

			//create data
			var data = {};
			data.historyEntryId		= 0;
			data.reference			= $scope.currentItem.refKey;
			data.scope				= "item";
			data.author				= $scope.currentUser.fullname;
			data.content			= content;

			$.post("ajax/items/saveOrUpdateHistoryEntry",data,function(response) {

				BRUNCH.notify("success","Successfully saved","The history entry was saved.");

			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving the history entry: '"+response.responseText+"'");
			});
		};

		$scope.saveHistoryforChangedData = function (oldItem, newItem)
		{
			if (oldItem.name != newItem.name)
			{
				$scope.saveHistoryEntry($scope.currentUser.fullname + " changed name from " + oldItem.name + " to " + newItem.name);
			}
			if (oldItem.structure != newItem.structure)
			{
				$scope.saveHistoryEntry($scope.currentUser.fullname + " changed structure from " + oldItem.structure + " to " + newItem.structure);
			}			
			if (oldItem.gridX != newItem.gridX)
			{
				$scope.saveHistoryEntry($scope.currentUser.fullname + " changed grid from " + oldItem.gridX + " to " + newItem.gridX);
			}
			if (oldItem.category != $scope.getActiveCategories())
			{
				$scope.newcat = $scope.getActiveCategories();
				$scope.saveHistoryEntry($scope.currentUser.fullname + " changed categories from " + oldItem.category.replace(/#/g,", ") + " to " + $scope.newcat.replace(/#/g,", "));
			}
			
			if(oldItem.storage != null)
			{
				if ((oldItem.storage != null && oldItem.storage.name != newItem.storage.name) || (oldItem.storage.value1 != newItem.storage.value1) || (oldItem.storage.value2 != newItem.storage.value2) || (oldItem.storage.value3 != newItem.storage.value3) || (oldItem.storage.value4 != newItem.storage.value4))
				{
					if (oldItem.storage.name == undefined)
					{
						$scope.saveHistoryEntry($scope.currentUser.fullname + " changed storage from not assigned to " + newItem.storage.name + " ("+newItem.storage.value1+","+newItem.storage.value2+","+newItem.storage.value3+","+newItem.storage.value4+")");			
					}
					else
					{
						$scope.saveHistoryEntry($scope.currentUser.fullname + " changed storage from " + oldItem.storage.name + " ("+oldItem.storage.value1+","+oldItem.storage.value2+","+oldItem.storage.value3+","+oldItem.storage.value4+")" + " to " + newItem.storage.name + " ("+newItem.storage.value1+","+newItem.storage.value2+","+newItem.storage.value3+","+newItem.storage.value4+")");
					}
				}
			}
		};

		//watch for dropped files in fileUploadDropBoxFiles
		$scope.$watch('fileUploadDropBoxFiles', function () {
			$scope.uploadFiles($scope.fileUploadDropBoxFiles);
		});

		/* ########## file management ########## */
		$scope.uploadFiles = function (files) {
			if (files && files.length) {
				BRUNCH.showSpinner();
				for (var i = 0; i < files.length; i++)
				{
					//if(i>0) {return;}
					var file = files[i];
					if (!file.$error) {
						Upload.upload({
							url: BRUNCH.config.pageRoot + '/ajax/files/uploadFileAsync',
							data: {
								file: file,
								moduleKey: "item",
								targetDir: $scope.currentProject.name +"/"+ $scope.currentItem.name + "/files/",
								filesKey: "file",
								fileName: false,
								overwrite: true
							},
						}).then(function (response) {
							//check if return is error or...
							if(!response.data.status) {
								BRUNCH.hideSpinner();
								BRUNCH.notify("error","Error","An error occurred while uploading the file: '"+response.data+"'");
							} else {
								//...success
								$timeout(function () {
									$scope.files.push({"path":response.data.path,"name":response.data.name});
									BRUNCH.hideSpinner();
									BRUNCH.notify("success","Successfully saved","File uploaded.");
									$scope.saveHistoryEntry($scope.currentUser.fullname + " uploaded File: " + response.data.name);
								});
							}
						});
					}
				}
			}
		};

		$scope.showDeleteFileButtons = function(key) {
			angular.element("#showFileDeleteButton"+key).hide();
			angular.element("#hideFileDeleteButton"+key).show();
			angular.element("#fileDeleteButton"+key).show();
			angular.element("#fileLinkButton"+key).addClass("moveDownloadButton");
		};
		$scope.hideDeleteFileButtons = function(key) {
			angular.element("#showFileDeleteButton"+key).show();
			angular.element("#hideFileDeleteButton"+key).hide();
			angular.element("#fileDeleteButton"+key).hide();
			angular.element("#fileLinkButton"+key).removeClass("moveDownloadButton");
		};

		$scope.deleteFile = function(fileName,key) {
			var data = {
				moduleKey: "item",
                filePath: $scope.currentProject.name +"/"+ $scope.currentItem.name + "/files/" + fileName

			};
			$.post("ajax/files/deleteFile",data,function(response) {
				if(response.error) {
					BRUNCH.notify("error","Error","An error occurred while deleting the file: '"+response.message+"'");
				} else {
					$scope.files.splice(key,1);
					$scope.$apply();
					BRUNCH.notify("success","Delete successfully","File deleted.");
					$scope.saveHistoryEntry($scope.currentUser.fullname + " deleted File: " + fileName);
				}
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the file: '"+response.responseText+"'");
			});
		};

		/* ########## profile management ########## */
		$scope.uploadProfileImage = function(dataUrl) {
			BRUNCH.showSpinner();
			Upload.upload({
				url: BRUNCH.config.pageRoot + '/ajax/files/uploadFileAsync',
				data: {
					image: Upload.dataUrltoBlob(dataUrl),
					moduleKey: "item",
					targetDir: $scope.currentProject.name +"/"+ $scope.currentItem.name +"/images/",
					filesKey: "image",
					fileName: "profile",
					overwrite: true
				},
			}).then(function (response) {
				//check if return is error
				if(!response.data.status)
				{
					BRUNCH.hideSpinner();
					BRUNCH.notify("error","Error","An error occurred while uploading the picture: '"+response.data+"'");
				}
				else
				{
					//success
					$timeout(function () {
						$scope.profileImage = response.data.path;
                        $scope.profileImage = $scope.profileImage + "?" + new Date().getTime();
						$scope.deleteSelectedProfileImage();
						BRUNCH.hideSpinner();
						BRUNCH.notify("success","Successfully saved","Picture uploaded.");
					});
				}
			});
		};

		$scope.deleteSelectedProfileImage = function() {
			$scope.pickedProfileImage	= false;
			$scope.croppedDataUrl		= false;
		};

		$scope.deleteProfileImage = function() {
			var data = {
				moduleKey: "item",
                filePath: $scope.currentProject.name +"/"+ $scope.currentItem.name  + "/images/profile.png"
			};

			$.post("ajax/files/deleteFile",data,function() {
				
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the item folder: '"+response.responseText+"'");
			});
		};

		$scope.deleteItemFolder = function(path) {
			var data = {
				moduleKey: "item",
                folderPath: $scope.currentProject.name +"/"+ $scope.currentItem.name + path
			};

			$.post("ajax/files/deleteFolder",data,function() {				
				
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the item folder: '"+response.responseText+"'");
			});
		};
		
		/* ########## delete Item ########## */
		$scope.deleteItemHandler = function() {

			//check for files
			if($scope.files.length > 0) {
				BRUNCH.notify("error","Error","Before you can delete this item you have to delete all attachments.");
				$scope.tab = 5;
				return;
			}

			//check if button is armed
			if(angular.element("#deleteItemButton").hasClass("armed")) {
				$scope.deleteItem();
			} else if(!angular.element("#deleteItemButton").hasClass("countdown")) {

				//set security countdown
				BRUNCH.notify("info","Delete requested","The button to delete this item will be activated in 5 seconds and is then active for another 5 seconds. Attention! The deletion of this item is irrevocable and final. All data stored for this item will be deleted.");
				angular.element("#deleteItemButton").addClass("disabled");
				angular.element("#deleteItemButton").addClass("countdown");
				var ct	= 5;
				angular.element("#deleteItemCounter").html("&nbsp;("+ct+")");
				angular.element("#deleteItemCounter").attr("data-ct",ct);
				var sCt = setInterval(function() {
					ct	= parseInt(angular.element("#deleteItemCounter").attr("data-ct"));
					ct		= ct-1;
					angular.element("#deleteItemCounter").html("&nbsp;("+ct+")");
					angular.element("#deleteItemCounter").attr("data-ct",ct);
					if(ct == -1) {
						clearInterval(sCt);

						//set armed button countdown
						BRUNCH.notify("warning","Delete item","This Item can be deleted within 5 seconds. Attention! The deletion of this item is irrevocable and final.");
						angular.element("#deleteItemButton").removeClass("disabled");
						angular.element("#deleteItemButton").addClass("armed");
						var ct	= 5;
						angular.element("#deleteItemCounter").html("&nbsp;("+ct+")");
						angular.element("#deleteItemCounter").attr("data-ct",ct);
						var aCt = setInterval(function() {
							ct	= parseInt(angular.element("#deleteItemCounter").attr("data-ct"));
							ct		= ct-1;
							angular.element("#deleteItemCounter").html("&nbsp;("+ct+")");
							angular.element("#deleteItemCounter").attr("data-ct",ct);
							if(ct == -1) {
								clearInterval(aCt);

								//arm button
								angular.element("#deleteItemButton").removeClass("countdown");
								angular.element("#deleteItemButton").removeClass("armed");
								angular.element("#deleteItemCounter").html("");
							}
						},1000);
					}
				},1000);
			}
		};

		$scope.deleteItem = function() {

			//create data
			var data = {};
			data.itemId	= $scope.currentItem.ID;
			data.ref	= $scope.currentItem.refKey;

			//delete attribute
			BRUNCH.showSpinner();
			$.post("ajax/items/deleteItemById",data,function(response)
			{
				$.post("ajax/items/deleteHistoryEntryByRef",data,function(response)
				{
					$scope.deleteProfileImage();
					$scope.deleteItemFolder("/images/");
					$scope.deleteItemFolder("/files/");
					
					setTimeout(function() {
						$scope.deleteItemFolder("/");
						BRUNCH.navigateTo(window.location.pathname);
						BRUNCH.hideSpinner();
					},2200);

				},"json").fail(function(response) {
					BRUNCH.hideSpinner();
				});				

			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the item: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};

		$scope.showNewItemDialog = function() {

			$scope.dialog = ngDialog.open({
				template:"modules/custom/items/view/uiElements/others/addItem-detail.dialog.html",
				scope:$scope
			});
		};

		$scope.chanceActive = function (id) {
			
			var selectedId = "#cat"+(id.replace(/\s+/g, '').toLowerCase());
			var catElement = angular.element( document.querySelector(selectedId) );
			
			if (catElement.hasClass("btn-active"))
			{
				catElement.removeClass("btn-active");
			}
			else
			{
				catElement.addClass("btn-active");
			}			
		}

	}]);
})();