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

	//Filter for Tree-Dropdown
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

	//Filter for delete all child nodes
	angular.module("hermine").filter("filterForDeleteAllChildNodes", function () {
		return function(nodeData){

			var returnArray = [];
			
			returnArray.push(nodeData);	
			hasNodes(nodeData);

			function hasNodes(node)
			{
				var temp = node.nodes;
				if (temp !== undefined || temp.length > 0)
				{
					for (const i in temp)
					{
						if (temp.hasOwnProperty(i))
						{
							const element = temp[i];
							
							returnArray.push(element);
							hasNodes(element);							
						}
					}
				}	
			}
			
			return returnArray;
		};
	});

	//Filter for storage
	angular.module("hermine").filter("filterStorage", function () {
		return function(projectStorage, items){

			var returnArray = [];
			var arr = [];
			
			for (let index = 0; index < projectStorage.length; index++)
			{
				arr.push(projectStorage[index]);
				if (((index + 1) % 5) == 0)
				{
					var data = {
						name: arr[0].value,
						value1: arr[1].value,
						value2: arr[2].value,
						value3: arr[3].value,
						value4: arr[4].value
					}
					returnArray.push(data);

					arr = [];
				}
			}			

			for (const i in returnArray)
			{
				if (returnArray.hasOwnProperty(i))
				{
					for (const y in items)
					{
						if (items.hasOwnProperty(y))
						{
							returnArray[i].inUse = false;
							let temp = items[y].storage; 
							
							if (temp != null)
							{
								if (temp.hasOwnProperty('name'))
								{
									returnArray[i].inUse = false;									
									if (temp.name.includes(returnArray[i].name))
									{
										returnArray[i].inUse = true; 
										break;
									}
								}								
							}
						}
					}
				}
			}
			
			return returnArray;
		};
	});

	//Filter category
	angular.module("hermine").filter("filterCategory", function () {
		return function(category, items){

			for (const i in category)
			{
				if (category.hasOwnProperty(i))
				{
					for (const y in items)
					{
						if (items.hasOwnProperty(y))
						{
							category[i].inUse = false;
							if (items[y].category.includes(category[i].value))
							{
								category[i].inUse = true; 
								break;
							}
						}
					}
				}
			}	
			
			return category;
		};
	});

	//Filter for storage Frontend
	angular.module("hermine").filter("filterStorageforFrontend", function () {
		return function(projectStorage, itemStorage){

			var temp = {};
			var data = {};

			if (itemStorage != null)
			{
				for (const i in projectStorage)
				{
					if (projectStorage.hasOwnProperty(i))
					{
						if (itemStorage.name == projectStorage[i].name)
						{
							temp = {
								name: itemStorage.name,
								value1: projectStorage[i].value1,
								value2: projectStorage[i].value2,
								value3: projectStorage[i].value3,
								value4: projectStorage[i].value4							
							}
							break;
						}
					}
				}	

				data = {
					selected: {
						name: itemStorage.name,
						value1: itemStorage.value1,
						value2: itemStorage.value2,
						value3: itemStorage.value3,
						value4: itemStorage.value4
					}
				}
			}
			
			data.template 	= projectStorage;
			data.temp 		= temp;
			
			return data;
		};
	});

})();