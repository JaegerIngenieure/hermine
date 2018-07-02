(function() {

	angular.module("hermine").directive("onEnter", function() { //@TODO checken ob verwendet
		return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.onEnter);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	});

	angular.module("hermine").directive("onEsc", function() {
		return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 27) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.onEsc);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	});

})();