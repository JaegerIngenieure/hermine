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
	angular.module("hermine").controller("ProjectsDetailController", ["$scope", "UsersFactory", "ProjectFactory", "$http", "$q", "$routeParams", "$location", "ngDialog", "$filter", "Upload", "$timeout", "$parse", "$sce", function($scope, UsersFactory, ProjectFactory, $http, $q, $routeParams, $location, ngDialog, $filter, Upload, $timeout, $parse, $sce) {

		$scope.currentProject 	= {};
		$scope.forms			= {};
		$scope.project			= {};
		$scope.store			= {};
		$scope.storageOverview  = {};
		$scope.searchUsedAttribute = {};

		$scope.files 			= [];

		$scope.test = [];
		$scope.onlyNumbers = /^\d+$/;

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;

            //check for user permission and redirect if on start page
            if($filter("getPerms")($scope.currentUser.permissions,"projects") < 70)
            {
                if(window.location.hash.includes("/evaluation"))
                {
					console.log("Worker-Evaluation-Access");
				}
				else if(window.location.hash.includes("/storages-overview/"))
				{
                    console.log("Worker-storages-overview-Access");
				}
				else
				{
                    BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/worker/"+$routeParams.id);
				}
            }

            if($filter("getPerms")($scope.currentUser.permissions,"projects") < 90)
            {
                angular.element("#deleteProjectButton").addClass("wt_hidden");
            }

			BRUNCH.hideSpinner();
		});

		//get all users
		$scope.users = [];
		BRUNCH.showSpinner();
		UsersFactory.getAllUsers(false).then(function(data) {
			$scope.users = data;
			BRUNCH.hideSpinner();
		});

		// functions for Angular Tree
		$scope.removeStructureItem = function (scope) {
			
			var nodes = [];
			var nodeData 	= scope.$modelValue;
			var ref			= $scope.currentProject.refKey;

			nodes = $filter("filterForDeleteAllChildNodes")(nodeData);

			for (const i in nodes)
			{
				if (nodes.hasOwnProperty(i))
				{
					//const element = nodes[i];
					scope.removeStructureNode(nodes[i], ref);
				}
			}

			$scope.reloadStructure();
		};

		$scope.toggle = function(scope) {
			scope.toggle();
		};

		$scope.moveLastToTheBeginning = function() {
			var a = $scope.data.pop();
			$scope.data.splice(0, 0, a);
		};

		$scope.createNewNode = function(name) {

		var groupId = BRUNCH.createGUID();
		var nameData = {};

		nameData.attID				= 0;
		nameData.attributeTypeId	= 3;
		nameData.attributeValue		= name;
		nameData.refId				= $scope.currentProject.refKey;
		nameData.groupId			= groupId;

		$scope.saveStructureNode(nameData);

		var parentData = {};

		parentData.attID			= 0;
		parentData.attributeTypeId	= 4;
		parentData.attributeValue	= "";
		parentData.refId			= $scope.currentProject.refKey;
		parentData.groupId			= groupId;

		var dataId = $scope.saveStructureNode(parentData);

			$scope.data.push({
				id: dataId,
				title: name,
				nodes: []
			});
			$scope.ngDialog.close();
			$scope.reloadStructure();
		};

		$scope.newSubItem = function(scope, name) {
			var nodeData = scope.$modelValue;

			var subGroupId = BRUNCH.createGUID();
			var subNameData = {};

			subNameData.attID				= 0;
			subNameData.attributeTypeId		= 3;
			subNameData.attributeValue		= name;
			subNameData.refId				= $scope.currentProject.refKey;
			subNameData.groupId				= subGroupId;

			$scope.saveStructureNode(subNameData);

			var SubParentData = {};

			SubParentData.attID				= 0;
			SubParentData.attributeTypeId	= 4;
			SubParentData.attributeValue	= nodeData.id;
			SubParentData.refId				= $scope.currentProject.refKey;
			SubParentData.groupId			= subGroupId;

			var dataId = $scope.saveStructureNode(SubParentData);

			nodeData.nodes.push({
			id: dataId,
			title: name,
			nodes: []
			});

			$scope.reloadStructure();
		};

		$scope.collapseAll = function() {
			$scope.$broadcast('angular-ui-tree:collapse-all');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('angular-ui-tree:expand-all');
		};
		// END

		BRUNCH.showSpinner();
		ProjectFactory.getProjectById($routeParams.id,true).then(function(data) {

			$scope.currentProject = data;

            console.log("$scope.currentProject");
			console.log($scope.currentProject);

			$scope.project.id 		= $scope.currentProject.Id;
			$scope.project.name 	= $scope.currentProject.name;
			$scope.project.comment 	= $scope.currentProject.comment;
			$scope.project.gridX	= $scope.currentProject.gridX;
			$scope.project.gridY	= $scope.currentProject.gridY;
            $scope.project.iframe	= $scope.currentProject.iframe;

            console.log("$scope.project");
            console.log($scope.project);

				//get files for Project				
				BRUNCH.showSpinner();
				ProjectFactory.getFilesForProject(true,"project", $scope.currentProject.name + "/files/").then(function(data) {
					$scope.files = data;
					BRUNCH.hideSpinner();
				});

			$scope.allItemforProject = [];
			BRUNCH.showSpinner();
			ProjectFactory.getAllItemsById($scope.currentProject.refKey, true).then(function(data) {
				$scope.allItemforProject = data;

				BRUNCH.showSpinner();
				ProjectFactory.getAllCategoriesForProject($scope.currentProject.refKey, true).then(function(data) {
					$scope.project.category = $filter("filterCategory")(data, $scope.allItemforProject);
					BRUNCH.hideSpinner();
				});

				BRUNCH.showSpinner();
				ProjectFactory.getAllStoragesForProject($scope.currentProject.refKey, true).then(function(data) {
					$scope.project.storage = $filter("filterStorage")(data, $scope.allItemforProject);
					BRUNCH.hideSpinner();
				});
				
				BRUNCH.hideSpinner();
			});			

			$scope.structureData = [];
			BRUNCH.showSpinner();
			ProjectFactory.getAllStructureNodesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.structureData = data;
				BRUNCH.hideSpinner();

				$scope.data = $filter("filterForStructure")($scope.structureData);
				$scope.project.structure = $scope.data;

				$scope.getItemsWithEmptyFields = [];
				BRUNCH.showSpinner();
				ProjectFactory.getItemsWithEmptyFields($scope.currentProject.refKey, true).then(function(data) {
					$scope.getItemsWithEmptyFields = data;
					
					for (const key in $scope.getItemsWithEmptyFields)
					{
						if ($scope.getItemsWithEmptyFields.hasOwnProperty(key))
						{
							if ($scope.getItemsWithEmptyFields[key].storage != "")
							{
								$scope.getItemsWithEmptyFields[key].storage = JSON.parse($scope.getItemsWithEmptyFields[key].storage);
							}
						}
					}
					BRUNCH.hideSpinner();
				});
			});

			//log current project
			BRUNCH.hideSpinner();
		});

		$scope.reloadStructure = function()
		{
			BRUNCH.showSpinner();
			setTimeout(function()
			{
				ProjectFactory.getAllStructureNodesForProject($scope.currentProject.refKey, true).then(function(data) {
					$scope.structureData = data;
					BRUNCH.hideSpinner();

					$scope.data = $filter("filterForStructure")($scope.structureData);
					$scope.project.structure = $scope.data;
				});
			},500);
		};

		$scope.updateProject = function() {

			BRUNCH.showSpinner();
			
			if (typeof $scope.project.gridX !== 'string')
			{
				$scope.project.gridX = "A";
				//$scope.project.gridX = $scope.project.gridX.toUpperCase();
			}

			if (typeof parseInt($scope.project.gridY) !== "number" || isNaN($scope.project.gridY))
			{
				$scope.project.gridY = 99;
			}

			let data = {
				Id: $scope.project.id,
				name: $scope.project.name,
				comment: $scope.project.comment,
				gridX: $scope.project.gridX.toUpperCase(),
				gridY: $scope.project.gridY,
				iframe: $scope.project.iframe
			};

			$scope.deleteStorage($scope.currentProject.refKey);
			$scope.saveComplexAttribute("category");
			
			// save data
			$.post("ajax/projects/updateProject",data,function(response) {
				BRUNCH.notify("success","Successfully saved","Project saved.");
				setTimeout(function(){
					location.reload();
					BRUNCH.hideSpinner();
				}, 1000);
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving the project: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};

		/* Add Field for Category */
		$scope.addAdditionalInput = function(areaId,inputClass)
		{
			switch(areaId)
			{
				case "categories":
					var inputTemplate = '<input type="text" name="additionalInput" class="form-control marginTop5 '+inputClass+'"/>';
				break;

				case "storage":
					var inputTemplate = `
					<div class="storageContainer">
						
						<input type="text" placeholder="Name" class="name form-control marginTop5 `+inputClass+`"/>
						<button type="button" class="btn clr-hermine btn-xs storageOcc" ng-click="openDialogSearchUsedAttributes(stor.name, 'storage')" disabled>
							<span class="glyphicon glyphicon-search" aria-hidden="true">
						</button>

						<div style="display: flex;">
							<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
							<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
							<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
							<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center" style="float: left;	margin-right: 10px;" disabled/>
						</div>
						
						<input type="text" value="0" class="form-control marginTop5 inputSize50px text-center inputStorage" maxlength="2"/>
						<input type="text" value="0" class="form-control marginTop5 inputSize50px text-center inputStorage" maxlength="2"/>
						<input type="text" value="0" class="form-control marginTop5 inputSize50px text-center inputStorage" maxlength="2"/>
						<input type="text" value="0" class="form-control marginTop5 inputSize50px text-center" maxlength="2"/>
					</div>
					<hr>
					`;
				break;
			}
			angular.element("#"+areaId).append(inputTemplate);
		};

		$scope.saveStorageAttributes = function(storage) {

			var currentAttribute	= {};
			var guid 				= BRUNCH.createGUID();
			var ref 				= $scope.currentProject.refKey;			

			if (storage[0] != "")
			{
				currentAttribute.attributeValue 	= storage[0];
				currentAttribute.attributeTypeId 	= 8;
				currentAttribute.refId 				= ref;
				currentAttribute.groupId			= guid;
				
				$.post("ajax/projects/saveStorage", currentAttribute, function (response) {

					currentAttribute.attributeValue 	= storage[3];

					if (currentAttribute.attributeValue == "")
					{
						currentAttribute.attributeValue = 0;
					}

					currentAttribute.attributeTypeId 	= 9;				
					
					$.post("ajax/projects/saveStorage", currentAttribute, function (response) {

						currentAttribute.attributeValue 	= storage[4];

						if (currentAttribute.attributeValue == "")
						{
							currentAttribute.attributeValue = 0;
						}

						currentAttribute.attributeTypeId 	= 10;
						
						$.post("ajax/projects/saveStorage", currentAttribute, function (response) {

							currentAttribute.attributeValue 	= storage[5];

							if (currentAttribute.attributeValue == "")
							{
								currentAttribute.attributeValue = 0;
							}

							currentAttribute.attributeTypeId 	= 11;
							
							$.post("ajax/projects/saveStorage", currentAttribute, function (response) {

								currentAttribute.attributeValue 	= storage[6];

								if (currentAttribute.attributeValue == "")
								{
									currentAttribute.attributeValue = 0;
								}

								currentAttribute.attributeTypeId 	= 12;
								
								$.post("ajax/projects/saveStorage", currentAttribute, function (response) {
									BRUNCH.notify("success", "Successfully saved", "The storage attributes were saved.");
									currentAttribute = {};
								}, "json").fail(function (response) {
									BRUNCH.notify("error", "Error", "An error occurred while saving the storage attributes: '" + response.responseText + "'");
								});

							}, "json").fail(function () {});

						}, "json").fail(function () {});

					}, "json").fail(function () {});

				}, "json").fail(function () {});				
			}
		};

		$scope.filterStrorage = function () {
			
			var value = [];

			angular.element(".storageContainer").each(function()
			{
				var eVal = angular.element(this);				
				
				eVal.children().each(function()
				{
					value.push(angular.element(this).val());
				});
				
				$scope.saveStorageAttributes(value);				
				value = [];				
			});
		};

		$scope.deleteStorage = function(ref) {

			var data = {
				refKey: ref
			};			

			$.post("ajax/projects/deleteStorage", data, function (response) {
				$scope.filterStrorage();
			}, "json").fail(function () {});
					
		};

		$scope.saveComplexAttribute = function(complexName) {

			var currentAttribute = {};
			var value = [];

			angular.element("."+complexName+"AddInputs").each(function() {
				var eVal = angular.element(this).val();

				if(eVal != "")
				{
					value.push(eVal);
				}
			});

			currentAttribute.attributeValue = value;
			currentAttribute.attributeTypeId = 1;
			currentAttribute.refId = $scope.currentProject.refKey;			

			//set value to space if empty
			if(currentAttribute.attributeValue.length > 0)
			{
				$scope.saveAttribute(currentAttribute);
			}
		};

		/* ########## save attribute ########## */
		$scope.saveAttribute = function(attribute)
		{
			//create new data
			let data = {};
			data.attributeValue		= attribute.attributeValue;
			data.attributeTypeId	= attribute.attributeTypeId;
			data.refId				= attribute.refId;
			data.groupId			= BRUNCH.createGUID();

			$.post("ajax/projects/saveOrUpdateAttribute", data, function (response) {
				BRUNCH.notify("success", "Successfully saved", "The attribute " + attribute.name + " was saved.");
			}, "json").fail(function (response) {
				BRUNCH.notify("error", "Error", "An error occurred while saving the attribute: '" + response.responseText + "'");
			});
		};
				
		/* ########## save Structure Node ########## */
		$scope.saveStructureNode = function(attribute)
		{
			//create new data
			let data = {};

			data.attributeId		= attribute.attID;
			data.attributeValue		= attribute.attributeValue;
			data.attributeTypeId	= attribute.attributeTypeId;
			data.refId				= attribute.refId;
			data.groupId			= attribute.groupId;

			$.post("ajax/projects/saveOrUpdateStructureNode",data,function(response) {
				BRUNCH.notify("success","Successfully saved","Node saved.");
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving the node: '"+response.responseText+"'");
			});
		};

		/* ########## remive Structure Node ########## */
		$scope.removeStructureNode = function(attribute, ref)
		{
			//create new data
			let data = {};
			
			data.attributeId		= attribute.id;
			data.refId				= ref;
			data.groupId			= attribute.groupId;
			
			$.post("ajax/projects/removeStructureNode",data,function(response) {
				BRUNCH.notify("success","Successfully removed","Node saved.");
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while removing the node: '"+response.responseText+"'");
			});
		};

		/* ########## Junction functions ########## */
		$scope.openDialogJunction = function() {
			$scope.ngDialog = ngDialog.open({
				template:"modules/custom/projects/view/uiElements/others/addNode.dialog.html",
				scope: $scope
			});
		};

		/* ########## Junction functions ########## */
		$scope.openDialogSearchUsedAttributes = function(name, attribute) {
			
			$scope.searchUsedAttribute.name 		= name;
			$scope.searchUsedAttribute.attribute 	= attribute;

			$scope.ngDialog = ngDialog.open({
				template:"modules/custom/projects/view/uiElements/others/searchUsedAttributes.dialog.html",
				scope: $scope
			});
		};

		/* ########## delete Project ########## */
		$scope.deleteProjectHandler = function() {

            if($filter("getPerms")($scope.currentUser.permissions,"projects") < 90)
            {
                BRUNCH.notify("error","Error","No permission to delete this project");
            	return false;
            }

			//check if button is armed
			if(angular.element("#deleteProjectButton").hasClass("armed")) {
				$scope.deleteProject();
			} else if(!angular.element("#deleteProjectButton").hasClass("countdown")) {

				//set security countdown
				BRUNCH.notify("info","Delete requested","The button to delete this project activates in 5 seconds and is then active for another 5 seconds. Attention! The deletion of the project is irrevocable and final. All data will be deleted.");
				angular.element("#deleteProjectButton").addClass("disabled");
				angular.element("#deleteProjectButton").addClass("countdown");
				var ct	= 5;
				angular.element("#deleteProjectCounter").html("&nbsp;("+ct+")");
				angular.element("#deleteProjectCounter").attr("data-ct",ct);
				var sCt = setInterval(function() {
					ct	= parseInt(angular.element("#deleteProjectCounter").attr("data-ct"));
					ct		= ct-1;
					angular.element("#deleteProjectCounter").html("&nbsp;("+ct+")");
					angular.element("#deleteProjectCounter").attr("data-ct",ct);
					if(ct == -1) {
						clearInterval(sCt);

						//set armed button countdown
						BRUNCH.notify("warning","Delete project","This project can be deleted within 5 seconds. Attention! The deletion is irrevocable and final.");
						angular.element("#deleteProjectButton").removeClass("disabled");
						angular.element("#deleteProjectButton").addClass("armed");
						var ct	= 5;
						angular.element("#deleteProjectCounter").html("&nbsp;("+ct+")");
						angular.element("#deleteProjectCounter").attr("data-ct",ct);
						var aCt = setInterval(function() {
							ct	= parseInt(angular.element("#deleteProjectCounter").attr("data-ct"));
							ct		= ct-1;
							angular.element("#deleteProjectCounter").html("&nbsp;("+ct+")");
							angular.element("#deleteProjectCounter").attr("data-ct",ct);
							if(ct == -1) {
								clearInterval(aCt);

								//arm button
								angular.element("#deleteProjectButton").removeClass("countdown");
								angular.element("#deleteProjectButton").removeClass("armed");
								angular.element("#deleteProjectCounter").html("");
							}
						},1000);
					}
				},1000);
			}
		};

		$scope.deleteProject = function() {

			//create data
			let data = {};
			data.projectId	= $scope.currentProject.Id;

			//delete project
			BRUNCH.showSpinner();
			$.post("ajax/projects/deleteProjectById",data,function(response) {
				BRUNCH.notify("success","Delete successfully","Project deleted. Redirecting.");
				setTimeout(function() {
					BRUNCH.navigateTo(window.location.pathname);
				},2000);
				BRUNCH.hideSpinner();
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the project: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};

		//item evaluation
		$scope.openevaluation = function () {

            if($filter("getPerms")($scope.currentUser.permissions,"projects") < 70)
            {
                // window.location.href = window.location.origin+"/projects#/detail/"+$routeParams.id+"/evaluation";
                // BRUNCH.navigateTo(BRUNCH.config.pageRoot+window.location.pathname+"#/detail/worker/"+projectId);
                BRUNCH.navigateTo(window.location.origin+"/projects#/detail/"+$routeParams.id+"/evaluation");
                // console.log(window.location.origin+"/projects#/detail/"+$routeParams.id+"/evaluation");
            }
            else
			{
				window.location.href = window.location.href+"/evaluation";
			}
		};

		$scope.print = function () {
			window.print();
		};

        //storage overview
        $scope.openStorageOverview = function(storageName) {

            if($filter("getPerms")($scope.currentUser.permissions,"projects") < 70)
            {
                BRUNCH.navigateTo(window.location.origin+"/projects#/detail/"+$routeParams.id+"/storages-overview/" + encodeURI(storageName));
            }
            else
            {
                window.location.href = window.location.href + "/storages-overview/" + encodeURI(storageName);
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
								moduleKey: "project",
								targetDir: $scope.currentProject.name + "/files/",
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
				moduleKey: "project",
                filePath: $scope.currentProject.name + "/files/" + fileName

			};
			$.post("ajax/files/deleteFile",data,function(response) {
				if(response.error) {
					BRUNCH.notify("error","Error","An error occurred while deleting the file: '"+response.message+"'");
				} else {
					$scope.files.splice(key,1);
					$scope.$apply();
					BRUNCH.notify("success","Delete successfully","File deleted.");
				}
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the file: '"+response.responseText+"'");
			});
		};
		/* ########## END - file management ########## */

	}]);
})();