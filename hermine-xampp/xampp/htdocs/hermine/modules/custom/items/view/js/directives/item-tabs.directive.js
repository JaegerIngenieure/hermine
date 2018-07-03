(function() {

	//Edit Item //@TODO Gibts das überhaupt noch? falls ja umbennenen nicht "tabs"
	angular.module("hermine").directive("itemDetailTab1", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-tab-1.html"
		};
	});

	angular.module("hermine").directive("itemDetailTab2", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-tab-2.html"
		};
	});

	angular.module("hermine").directive("itemDetailTab3", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-tab-3.html"
		};
	});

})();