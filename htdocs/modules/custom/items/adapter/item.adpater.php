<?php

class ItemAdapter extends AbstractAdapterBase {

	private $query_getAllItems 		= "CALL sp_list_items_by_project_id('{id}');";
	private $query_saveItem 		= "CALL sp_save_item('{name}','{gridX}','{gridY}','{structure}','{category}','{comment}','{creator}','{projectRef}','{refKey}');";
	private $query_getItemById 		= "CALL sp_get_item({id});";
	private $query_updateItem 		= "CALL sp_update_item('{refKey}','{name}','{gridX}','{gridY}','{structure}','{category}','{comment}','{storage}');";
	private $query_deleteItemById 	= "CALL sp_delete_item_by_id ('{itemId}');";

	private $personModule;

	function __construct($dbConnector, $adapters,$personModule)
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
			$item->storage 		= $row['storage'];
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
		$item->storage 		= $row['storage'];
		$item->projectRef 	= $row['projectRef'];
		$item->refKey 		= $row['refKey'];
		
		return $item;
	}
}
?>