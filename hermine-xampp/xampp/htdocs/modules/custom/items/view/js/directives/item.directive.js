(function() {

	//Edit Item
	angular.module("hermine").directive("itemDetail1", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-1.html"
		};
	});

	angular.module("hermine").directive("itemDetail2", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-2.html"
		};
	});

	angular.module("hermine").directive("itemDetail3", function() {
		return {
			restrict: "E",
			templateUrl: BRUNCH.config.pageRoot+"/modules/custom/items/view/uiElements/detail/item-detail-3.html"
		};
	});

})();