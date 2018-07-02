<?php

class AttributesAdapter extends AbstractAdapterBase {

	private $query_sp_delete_attribute_by_refId_and_Type 	= "CALL sp_delete_attribute_by_refId_and_Type('{ref}',{type})";
	private $query_sp_list_all_categories_for_project		= "CALL sp_list_all_categories_for_project('{ref}',{type})";
	private $query_sp_list_all_nodes_for_project			= "CALL sp_list_all_nodes_for_project('{ref}')";

	private $query_getAttributeValuesByReferenceId = "CALL sp_list_attribute_by_referenceId ('{scope}',{id});";
	private $query_updateAttributeValue = "CALL sp_update_attribute ({id}, {type},'{value}','{groupId}');";
	private $query_createAttributeValue = "CALL sp_save_attribute ({type},'{value}','{referenceId}','{groupId}');";
	
	private $query_deleteAttributByGroupId = "CALL sp_delete_attribute_by_group_id ('{groupId}', '{referenceId}');";
	private $query_deleteAttributeById = "CALL sp_delete_attribute('{attributeId}');";
	private $query_replaceAttributeValue = "CALL sp_replace_attribute_value('{attributeTypeId}','{oldValue}','{newValue}')";

	private $processedIds = array();

    function __construct($dbController, $adapters) {
        parent::__construct($dbController, $adapters);
    }


	function getAllCategoriesForProject($id)
	{
		if ($id != "")
		{
			$query = str_replace("{ref}", $id, $this->query_sp_list_all_categories_for_project);
			$query = str_replace("{type}", 1, $query);
			
			$results = $this->databaseController->executeStoredProcedureToArray($query);
		}
		else
		{
			$results = [];
		}

		return $results;
	}
	
	function getAllStructureNodesForProject($refKey)
	{
		if ($refKey != "")
		{
			$query = str_replace("{ref}", $refKey, $this->query_sp_list_all_nodes_for_project);
			$results = $this->databaseController->executeStoredProcedureToArray($query);
		}
		else
		{
			$results = [];
		}

		return $results;
	}
	

	/**
	 * removes the value of the attribute that matches the id from the database
	 */
	function removeAttributeById($attributeId) {

		$query = str_replace("{attributeId}", $attributeId,$this->query_deleteAttributeById);
		$returnValue = true;

		try {
			$this->databaseController->executeInsertQuery($query);
		} catch(Exception $ex) {
			$returnValue = false;
		}

		return $returnValue;
	}
		
	/**
	 * remove the attribute by the group id for the specific reference id
	 */
	function removeAttributeByGroupId($groupId,$referenceId) {

		$query = str_replace("{groupId}", $groupId,$this->query_deleteAttributByGroupId);
		$query = str_replace("{referenceId}", $referenceId, $query);

		$returnValue = true;

		try {
			$this->databaseController->executeInsertQuery($query);
		} catch(Exception $ex) {
			$returnValue = false;
		}

		return $returnValue;

	}

	function saveOrUpdateAttribute($attributeId,$attributeTypeId,$attributeValues,$referenceId,$groupId) {
		
		$id = 0;
		if ($attributeId > 0) {
			// updated
			$query = str_replace("{type}", $attributeTypeId, $this->query_updateAttributeValue);
			$query = str_replace("{id}", $attributeId, $query);
			$query = str_replace("{value}",$attributeValues,$query);
			$query = str_replace("{groupId}",$groupId,$query);
			$id = $attributeId;

			$asd = $this->databaseController->executeInsertQuery($query);
		} 
		else
		{
			$delQuery = $this->query_sp_delete_attribute_by_refId_and_Type;
			$delQuery = str_replace("{ref}", $referenceId,$delQuery);
			$delQuery = str_replace("{type}", $attributeTypeId,$delQuery);
						
			$this->databaseController->executeInsertQuery($delQuery);

			// create new
			
			foreach ($attributeValues as $value)
			{
				$query = str_replace("{type}", $attributeTypeId, $this->query_createAttributeValue);
				$query = str_replace("{referenceId}",$referenceId,$query);
				$query = str_replace("{groupId}",$groupId,$query);
				$query = str_replace("{value}",$value,$query);
				$result = $this->databaseController->executeStoredProcedureToArray($query);
			}
			
			$id = $result[0]['insertId'];
		}

		return $id;
	}

	function saveOrUpdateStructureNode($attributeId,$attributeTypeId,$attributeValues,$referenceId,$groupId) {
		
		$id = 0;
		if ($attributeId > 0)
		{
			// updated
			$query = str_replace("{type}", $attributeTypeId, $this->query_updateAttributeValue);
			$query = str_replace("{id}", $attributeId, $query);
			$query = str_replace("{value}",$attributeValues,$query);
			$query = str_replace("{groupId}",$groupId,$query);
			$id = $attributeId;

			$asd = $this->databaseController->executeInsertQuery($query);
		} 
		else
		{
			$query = str_replace("{type}", $attributeTypeId, $this->query_createAttributeValue);
			$query = str_replace("{referenceId}", $referenceId, $query);
			$query = str_replace("{groupId}", $groupId, $query);
			
			if ($attributeValues == "")
			{
				$query = str_replace("{value}", "", $query);
			}
			else
			{
				$query = str_replace("{value}", $attributeValues, $query);
			}
			
			$result = $this->databaseController->executeStoredProcedureToArray($query);
			
			$id = $result[0]['insertId'];
		}

		return $id;
	}

	function removeStructureNode($attributeId,$referenceId,$groupId) {
		
		// remove
		$query = str_replace("{groupId}", $groupId, $this->query_deleteAttributByGroupId);
		$query = str_replace("{referenceId}", $referenceId, $query);
				
		$returnValue = true;

		try
		{
			$this->databaseController->executeInsertQuery($query);
		}
		catch(Exception $ex)
		{
			$returnValue = false;
		}

		return $returnValue;		
	}

	/*................. utils......................*/

	// cerate an attribute type object
	function buildAttributeTypeFromDatabaseRow($row) {

		$attributeType = new AttributeType();

		$attributeType->attributeTypeId 	= $row['attributeTypeId'];
		$attributeType->name 				= $row['name'];
		$attributeType->dataType 			= $row['dataType'];
		$attributeType->parent 				= $row['parent'];
		$attributeType->scope 				= $row['scope'];
		$attributeType->selectionValues 	= $row['selectionValues'];
		$attributeType->isActive 			= (bool)$row['isActive'];

		return $attributeType;
	}
	
	// replaces the sepcified old value with the definied new value for the specified
	// attributeTypeId
	function replaceAttributeValue($attributeTypeId, $oldValue, $newValue) {
		$query = $this->query_replaceAttributeValue;
		$data = "";

		$query = str_replace("{attributeTypeId}",$attributeTypeId,$query);
		$query = str_replace("{oldValue}",$oldValue,$query);
		$query = str_replace("{newValue}",$newValue,$query);

		$this->databaseController->executeInsertQuery($query);
		$data = true;

		return $data;
	}

	// creates an attribute instance from the database row
	function buildAttributesFromDatabaseRow($row)
	{
		$attribute = new Attribute();

		$attribute->attributeId 	= $row['attributeId'];
		$attribute->attributeType 	= $row['attributeTypeId'];
		$attribute->value 			= $row['value'];
		$attribute->groupId 		= $row['groupId'];
		$attribute->referenceId 	= $row['referenceId'];

		return $attribute;
	}

	/**
	 * creates the list that contains the whole attributes for the different types
	 */
	function buildAttributeList(&$attributeValues,$attributeTypes){
		$attributesList = array();


		foreach ($attributeTypes as $type) {

			$attribute = null;

			if ($type->attributes > 0) {
				$attribute = new Attribute();
				$attribute->attributeType = $type;

				$attribute->attributes = $this->buildAttributeList($attributeValues, $type->attributes);
				$attributesList[] = $attribute;
			}

			foreach ($attributeValues as $key => $attributeValue) {

				if ($attributeValue->attributeType == $type->attributeTypeId && $this->processedIds[$key] == null) {
					$attribute = $attributeValue;

					$attribute->attributeType = $type;
					$this->processedIds[$key] = $key;
					$attributesList[] = $attribute;

				}
			}
			
			if($attribute == null) {
				$attribute = new Attribute();



				$attribute->attributeType = $type;

				if (count($type->attributes) > 0) {
					$attribute->attributes = $this->buildAttributeList($attributeValues, $type->attributes);
				}

				if ($this->processedIds[$attribute->attributeId] == null) {
					$this->processedIds[$attribute->attributeId] = $attribute->attributeId;
					$attributesList[] = $attribute;
				}
			}
		}

		return $attributesList;
	}
}
?>