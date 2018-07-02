(function() {

	//Filter for Structuretree
	angular.module("hermine").filter("filterForStructure", function () {
		return function(projectStructure){

			var returnArray = [];
			
			listCurrentParents(projectStructure, false);

			//list all parent element of current level
			function listCurrentParents(els, pId)
			{
				//iterate all existing elements
				for(let i in els)
				{
					if(els.hasOwnProperty(i))
					{
						//check if current element has no parents if no parentId is passed or matches passed id
						if((!pId && els[i].parent === "") || (pId && els[i].parent === pId))
						{
							var cEl	= els[i];
							cEl.nodes = [];
							cEl.nodes = buildChildStructure(cEl);

							if(!pId && els[i].parent === "")
							{
								returnArray.push(cEl);
							}
						}
					}
				}
			}

			//get all childs for passed element
			function buildChildStructure(el)
			{
				let cChildStructure = [];

				//iterate all elements
				for(let i in projectStructure)
				{
					if(projectStructure.hasOwnProperty(i))
					{
						//check if element is matching parent id
						if(projectStructure[i].parent === el.id)
						{
							cChildStructure.push(projectStructure[i]);
						}
					}
				}

				//if has children check further
				if(cChildStructure.length > 0)
				{
					listCurrentParents(cChildStructure,el.id);
				}

				//return structure
				return cChildStructure;
			}

			//return modified structure
			return returnArray;

		};
	});

	//Filter für Tree-Dropdown
	angular.module("hermine").filter("filterForDropdown", function () {
		return function(projectStructure){

			var returnArray = [];
			var count = 1;	

			listCurrentParents(projectStructure);

			function listCurrentParents(els)
			{
				for(let i in els)
				{
					if(els.hasOwnProperty(i))
					{
						returnArray.push(els[i].name);
						
						if (els[i].nodes.length > 0)
						{
							hasNodes(els[i].nodes);
						}
					}
				}
			}

			function hasNodes(el)
			{
				let text = "";
				
				for (let i in el)
				{
					if (el.hasOwnProperty(i))
					{
						for (y = 0; y < count; y++)
						{ 
							text += "-";
						}

						returnArray.push(text+" "+el[i].name);
						text = "";

						//hasNodes(el[i]);
						if (el[i].nodes.length > 0)
						{
							count += 1;
							hasNodes(el[i].nodes);
							count -= 1;
						}
					}
				}				
			}

			return returnArray;

		};
	});

})();