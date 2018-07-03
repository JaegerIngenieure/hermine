<?php

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

class ItemModule extends AbstractModuleBase {
    public $name 	= "Items";
    public $key 	= "items";

    // this is the equivalent ot the url path for the module
    public $description 		= "Management of Items";
    public $title 				= "Items";
    public $permissions 		= array("50" => "Moderator");
    public $hasAdminPanel 		= true;
    public $hasUserAdminPanel 	= true;
	public $showAtHome 			= true;
    public $adapters 			= array();

    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addModule($this->key, $this);
        $this->includeFiles(dirname(__FILE__));
		$dbController = $this->controller->getDatabaseController();

		$this->adapters['attributes'] 	= new AttributesAdapter($dbController, $this->adapters);
		$this->adapters['item'] 		= new ItemAdapter($dbController, $this->adapters, $this->controller->getModule('person'));
		$this->adapters['history'] 		= new HistoryAdapter($dbController,$this->adapters, $this->controller->getModule('auth'));

	}

    function getJs() {

		return array(
        				//routes
        				$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/routes.js",

        				//controllers
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/item.controller.js",
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/item-detail.controller.js",
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/item-add.controller.js",
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/item-add-detail.controller.js",

						//directives
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/directives/item.directive.js",

						//services
						$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/services/item.factory.js",
						$this->getContextController()->customModulesRootUrl . "/projects/view/js/services/project.factory.js"
					);
    }

    function getCss() {

		return array($this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/css/style.css");
    }
	
	/*------------------------------------------ AJAX Methods --------------------------------------------------*/

	/**
	 * removes the attribute that is specified by the given id
	 */
	function removeAttributeById($params) {
		$attributeId = $params['attributeId'];
		$data = $this->adapters['attributes']->removeAttributeById($attributeId);

		return $data;
	}

	/*---------------------------- Item stuff -----------------------*/

	function getAllItemsById($params)
	{
		$projectId = $params['projectRef'];
		return $this->adapters['item']->getAllItemsById($projectId);
	}

	function getItemById($params)
	{
		return $this->adapters['item']->getItemById($params['itemId']);
	}
	
	function deleteItemById($params)
	{
		$data = $this->adapters['item']->deleteItemById($params['itemId']);

		return $data;
	}

	function saveOrUpdateItem($params) {

		$item = new Item();

		$item->ID			= $params['ID'];
		$item->name 		= $params['name'];
		$item->gridX 		= $params['gridX'];
		$item->gridY 		= $params['gridY'];
		$item->structure 	= $params['structure'];
		$item->category 	= $params['category'];
		$item->comment 		= $params['comment'];
		$item->creator 		= $params['creator'];
		$item->storage 		= $params['storage'];
		$item->projectRef 	= $params['projectRef'];
		$item->refKey		= $params['refKey'];

		$itemId = $this->adapters['item']->saveOrUpdateItem($item);

		return $itemId;
	}

	/**
	 * saves as new attribute or updates a existing one
	 */
	function saveOrUpdateAttribute($params)
	{
		$attributeId 		= $params['attributeId'];
		$attributeValue 	= $params['attributeValue'];
		$itemId 			= $params['itemId'];
		$attributeTypeId 	= $params['attributeTypeId'];
		$groupId 			= $params['groupId'];

		$result = 0;

		try
		{
			$result = $this->adapters['attributes']->saveOrUpdateAttribute($attributeId,$attributeTypeId,$attributeValue,$itemId,$groupId);
		}
		catch (Exception $ex)
		{
			$result = new BrunchError($this->key,"10","Failed to store data","saveOrUpdateAttribute");
		}

		return $result;
	}
	
	/**
	 * removes the attribute by the given parameter
	 */
	function deleteAttributeByGroupId($params) {
		$groupId = $params['groupId'];
		$referenceId = $params['referenceId'];

		$result = $this->adapters['attributes']->removeAttributeByGroupId($groupId, $referenceId);

		return $result;
	}

	/*----------------- History entries ------------------*/
	function saveOrUpdateHistoryEntry ($params)
	{
		$entry = new HistoryEntry();

		$entry->historyEntryId 	= $params['historyEntryId'];
		$entry->reference 		= $params['reference'];
		$entry->scope 			= $params['scope'];
		$entry->author 			= $params['author'];
		$entry->content 		= $params['content'];

		return $this->adapters['history']->saveOrUpdateHistoryEntry($entry);
	}

	function getHistoryEntryForReferenceId($params) {

		return $this->adapters['history']->getHistoryEntryForReferenceId($params['refKey'],$params['scope']);
	}

}
?>