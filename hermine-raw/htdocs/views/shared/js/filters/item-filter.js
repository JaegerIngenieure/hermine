(function() {

	//Filter remove Spaces then Lowercase
	angular.module("hermine").filter("removeSpacesThenLowercase", function () {
		return function (text) {
			var str = text.replace(/\s+/g, '');
			return str.toLowerCase();
			  };
	});

	//Filter for Categories
	angular.module("hermine").filter("filterCategoriesActive", function () {
		return function (AllProjectCat, ActiveCat) {

			var arrActiveCat = [];

			arrActiveCat = ActiveCat.split("#");

			for(let i in AllProjectCat)
			{
				if(AllProjectCat.hasOwnProperty(i))
				{
					for (const y in arrActiveCat)
					{
						if(arrActiveCat.hasOwnProperty(y))
						{
							if(AllProjectCat[i].value === arrActiveCat[y])
							{
								AllProjectCat[i].active = true;
								break;
							}
							else
							{
								AllProjectCat[i].active = false;
							}							
						}
					}										
				}
			}
			
			return AllProjectCat;
		};
	});
	
})();