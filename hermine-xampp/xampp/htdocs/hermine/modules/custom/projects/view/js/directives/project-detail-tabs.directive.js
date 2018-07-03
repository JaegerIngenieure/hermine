(function() {

	angular.module("hermine").directive("projectDetailTab1", function() { //@TODO Gibts das überhaupt noch? falls ja umbennenen nicht "tabs"
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-tab-1.html"
		};
	});

	angular.module("hermine").directive("projectDetailTab2", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-tab-2.html"
		};
	});

	angular.module("hermine").directive("projectDetailTab3", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/projects/view/uiElements/detail/project-detail-tab-3.html"
		};
	});

})();