(function() {
	angular.module("hermine").controller("ProjectsDetailController", ["$scope", "UsersFactory", "ProjectFactory", "$http", "$q", "$routeParams", "$location", "ngDialog", "$filter", "Upload", "$timeout", "$parse", "$sce", function($scope, UsersFactory, ProjectFactory, $http, $q, $routeParams, $location, ngDialog, $filter, Upload, $timeout, $parse, $sce) {

		$scope.currentProject				= {};
		$scope.forms						= {};
		$scope.project						= {};
		$scope.store						= {};

		//get current user
		$scope.currentUser = {};
		BRUNCH.showSpinner();
		UsersFactory.getCurrentUser(false).then(function(data) {
			$scope.currentUser = data;
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
			console.log("S Remove STEP 1");
			
			var nodeData 	= scope.$modelValue;
			var ref			= $scope.currentProject.refKey;
			
			scope.removeStructureNode(nodeData, ref);

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
			$scope.ngDialog.close()
			$scope.reloadStructure();
		}

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

			$scope.project.id 		= $scope.currentProject.Id;
			$scope.project.name 	= $scope.currentProject.name;
			$scope.project.comment 	= $scope.currentProject.comment;
			$scope.project.gridX	= $scope.currentProject.gridX;
			$scope.project.gridY	= $scope.currentProject.gridY;
			$scope.project.storage	= $scope.currentProject.storage;

			BRUNCH.showSpinner();
			ProjectFactory.getAllCategoriesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.project.category = data;
				BRUNCH.hideSpinner();
			});

			$scope.structureData = [];
			BRUNCH.showSpinner();
			ProjectFactory.getAllStructureNodesForProject($scope.currentProject.refKey, true).then(function(data) {
				$scope.structureData = data;
				BRUNCH.hideSpinner();

				$scope.data = $filter("filterForStructure")($scope.structureData);
				$scope.project.structure = $scope.data;
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
		}

		$scope.updateProject = function() {

			if (typeof $scope.project.gridX !== 'string')
			{
				$scope.project.gridX = "A";
				//$scope.project.gridX = $scope.project.gridX.toUpperCase();
			}

			if (typeof parseInt($scope.project.gridY) !== "number" || isNaN($scope.project.gridY))
			{
				$scope.project.gridY = 99;
			}

			var data = {
				Id: $scope.project.id,
				name: $scope.project.name,
				comment: $scope.project.comment,
				gridX: $scope.project.gridX.toUpperCase(),
				gridY: $scope.project.gridY,
				storage: $scope.project.storage
			};

			$scope.saveComplexAttribute("category");

			//save data
			$.post("ajax/projects/updateProject",data,function(response) {
				BRUNCH.notify("success","Successfully saved","Project saved.");
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while saving the project: '"+response.responseText+"'");
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
					var inputTemplate = `<hr>
					<input type="text" placeholder="Name" class="form-control marginTop5 `+inputClass+`"/>
					<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
					<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
					<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center inputStorage" disabled/>
					<input type="text" value="01" class="form-control marginTop5 inputSize50px text-center" disabled/>
					
					<input type="text" placeholder="99" class="form-control marginTop5 inputSize50px text-center inputStorage `+inputClass+`" maxlength="2"/>
					<input type="text" placeholder="99" class="form-control marginTop5 inputSize50px text-center inputStorage `+inputClass+`" maxlength="2"/>
					<input type="text" placeholder="99" class="form-control marginTop5 inputSize50px text-center inputStorage `+inputClass+`" maxlength="2"/>
					<input type="text" placeholder="99" class="form-control marginTop5 inputSize50px text-center `+inputClass+`" maxlength="2"/>
					`;
				break;
			}
			angular.element("#"+areaId).append(inputTemplate);
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
			currentAttribute.name = complexName;

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
			var data = {};
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
			var data = {};

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
			console.log("S Remove STEP 2");
			//create new data
			var data = {};
			
			data.attributeId		= attribute.id;
			data.refId				= ref;
			data.groupId			= attribute.groupId;
			
			$.post("ajax/projects/removeStructureNode",data,function(response) {
				console.log("S Remove STEP 4");
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
		
		/* ########## delete Project ########## */
		$scope.deleteProjectHandler = function() {

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
			var data = {};
			data.projectId	= $scope.currentProject.Id;

			//delete project
			BRUNCH.showSpinner();
			$.post("ajax/projects/deleteProjectById",data,function(response) {
				BRUNCH.notify("success","Delete successfully","Project deleted. Redirecting.");
				setTimeout(function() {
					BRUNCH.navigateTo(window.location.pathname);
				},3000);
				BRUNCH.hideSpinner();
			},"json").fail(function(response) {
				BRUNCH.notify("error","Error","An error occurred while deleting the project: '"+response.responseText+"'");
				BRUNCH.hideSpinner();
			});
		};

	}]);
})();