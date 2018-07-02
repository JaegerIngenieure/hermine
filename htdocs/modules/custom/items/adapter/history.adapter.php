<?php

class HistoryAdapter extends AbstractAdapterBase {

  	// queries
  	private $query_save_historyentry = "CALL sp_save_historyentry ('{reference}','{scope}','{author}','{content}');";
	private $query_update_historyentry = "CALL sp_update_historyentry ('historyEntryId','reference','scope','contactType','author','content','isPublic','reminder','attachment');";
	private $query_list_historyentry_for_reference = "CALL sp_list_historyentries('{refKey}','{scope}');";

	// fields
	private $authModule;
	
    function __construct($dbConnector, $adapters, $authModule) {
        parent::__construct($dbConnector, $adapters);
		$this->authModule = $authModule;
    }

	function saveOrUpdateHistoryEntry($entry)
	{
		if ($entry->historyEntryId == 0)
		{
			$query = $this->query_save_historyentry;
		}
		else
		{
			$query = $this->query_update_historyentry;
		}
		
		$query = str_replace("{reference}", $entry->reference, $query);
		$query = str_replace("{scope}", $entry->scope, $query);
		$query = str_replace("{author}", $entry->author, $query);
		$query = str_replace("{content}", $entry->content, $query);		
		
		//if->new history entry, else->update
		if ($entry->historyEntryId == 0)
		{
			$result = $this->databaseController->executeStoredProcedureToArray($query);
			$returnValue = $result[0]['insertId'];
		}
		else
		{
			$result = $this->databaseController->executeInsertQuery($query);
			$returnValue = $entry->historyEntryId;
		}

		return $returnValue;
	}

	function getHistoryEntryForReferenceId($refKey,$scope) {
		$query = $this->query_list_historyentry_for_reference;
		$query = str_replace("{refKey}", $refKey, $query);
		$query = str_replace("{scope}",$scope,$query);

		try
		{
			$requestResult = $this->databaseController->executeStoredProcedureToArray($query);

			$result = array();
			foreach ($requestResult as $row)
			{
				$result[] = $this->buildHistoryEntryFromDatabaseRow($row);
			}

		}
		catch (Exception $ex)
		{
			$result = new BrunchError("HistoryAdapter","400","Could not load data","getHistoryEntryForReferenceId");
		}

		return $result;
	}
		
  	function buildHistoryEntryFromDatabaseRow($row) {
  		$entry = new HistoryEntry();

		$entry->historyEntryId 	= $row['historyEntryId'];
		$entry->reference 		= $row['reference'];
		$entry->scope 			= $row['scope'];
		$entry->created 		= $row['created'];
		$entry->author 			= $row['author'];
		$entry->content 		= $row['content'];
		$entry->attachment 		= $row['attachment'];
		
		return $entry;
  	}

}
?>