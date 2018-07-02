(function() {

	angular.module("hermine").directive("projectDetail1", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-1.html"
		};
	});

	angular.module("hermine").directive("projectDetail2", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-2.html"
		};
	});

	angular.module("hermine").directive("projectDetail3", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-3.html"
		};
	});

})();