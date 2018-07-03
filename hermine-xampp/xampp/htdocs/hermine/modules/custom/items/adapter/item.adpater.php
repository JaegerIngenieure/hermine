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

class ItemAdapter extends AbstractAdapterBase {

	private $query_getAllItems 		= "CALL sp_list_items_by_project_id('{id}');";
	private $query_saveItem 		= "CALL sp_save_item('{name}','{gridX}','{gridY}','{structure}','{category}','{comment}','{creator}','{projectRef}','{refKey}');";
	private $query_getItemById 		= "CALL sp_get_item({id});";
    private $query_getItemByStorage	= "CALL sp_list_items_by_storage_name('{name}');";
	private $query_updateItem 		= "CALL sp_update_item('{refKey}','{name}','{gridX}','{gridY}','{structure}','{category}','{comment}','{storage}');";
	private $query_deleteItemById 	= "CALL sp_delete_item_by_id ('{itemId}');";

	private $personModule;

	function __construct($dbConnector, $adapters, $personModule)
	{
        parent::__construct($dbConnector, $adapters);

		$this->personModule = $personModule;
    }

	function getAllItemsById($projectRef)
	{
		$query = str_replace("{id}", $projectRef, $this->query_getAllItems);
		$allItems = $this->databaseController->executeQueryToArray($query);
		$allItems = $this->buildItems($allItems);

		return $allItems;
	}

    function getAllItemsForStorage($storageName) {
        $query = str_replace("{name}", $storageName, $this->query_getItemByStorage);
        $items = $this->databaseController->executeQueryToArray($query);
        $items = $this->buildItems($items);

        return $items;
    }

	function getItemById($itemId, $withAttributes = false)
	{
		$query = str_replace("{id}", $itemId, $this->query_getItemById);
		$result = $this->databaseController->executeStoredProcedureToArray($query);
		
		$item = $this->buildItemFromDatabaseRow($result[0], $withAttributes);

		return $item;
	}
	
	function saveOrUpdateItem($item)
	{
		if ($item->ID > 0)
		{
			$query = $this->query_updateItem;
		}
		else
		{
			$query = $this->query_saveItem;

			$query = str_replace('{creator}', $item->creator, $query);
			$query = str_replace('{projectRef}', $item->projectRef, $query);			
		}

		$query = str_replace('{refKey}', $item->refKey, $query);
		$query = str_replace('{name}', $item->name, $query);
		$query = str_replace('{gridX}', $item->gridX, $query);
		$query = str_replace('{gridY}', $item->gridY, $query);
		$query = str_replace('{structure}', $item->structure, $query);
		$query = str_replace('{category}', $item->category, $query);
		$query = str_replace('{comment}', $item->comment, $query);
		$query = str_replace('{storage}', $item->storage, $query);
		
		if ($item->id > 0)
		{
			$id = $item->id;
			$result = $this->databaseController->executeStoredProcedureToArray($query);
		}
		else
		{
			$result = $this->databaseController->executeStoredProcedureToArray($query);
			$id = $result[0]['insertId'];
		}
		return $id;
	}
	
	
	function deleteItemById($itemId)
	{
		$query = str_replace("{itemId}", $itemId, $this->query_deleteItemById);
		$result = true;

		try
		{
			$this->databaseController->executeInsertQuery($query);
		} catch (Exception $ex)
		{
			$result = false;
		}

		return $result;
	}

	private function buildItems($items)
	{
		$allItems = array();
		
		foreach ($items as $row)
		{
			$item = new Item();

			$item->ID 			= $row['ID'];
			$item->name 		= $row['name'];
			$item->gridX 		= $row['gridX'];
			$item->gridY 		= $row['gridY'];
			$item->structure 	= $row['structure'];
			$item->category 	= $row['category'];
			$item->comment 		= $row['comment'];
			$item->creator 		= $row['creator'];
			$item->storage 		= json_decode($row['storage'], true);
			$item->projectRef 	= $row['projectRef'];
			$item->refKey 		= $row['refKey'];
		
			array_push($allItems, $item);
		}
		
		return $allItems;
	}

	private function buildItemFromDatabaseRow ($row,$withAttributes)
	{
		$item = new Item();

		$item->ID 			= $row['ID'];
		$item->name 		= $row['name'];
		$item->gridX 		= $row['gridX'];
		$item->gridY 		= $row['gridY'];
		$item->structure 	= $row['structure'];
		$item->category 	= $row['category'];
		$item->comment 		= $row['comment'];
		$item->creator 		= $row['creator'];
		$item->storage 		= json_decode($row['storage'], true);
		$item->projectRef 	= $row['projectRef'];
		$item->refKey 		= $row['refKey'];
		
		return $item;
	}
}
?>