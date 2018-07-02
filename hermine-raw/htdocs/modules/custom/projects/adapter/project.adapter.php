<?php

class ProjectAdapter extends AbstractAdapterBase {

	// fields
	private $personModule;
	private $authModule;

	// sp names
	private $sp_create_project = "CALL sp_save_project('#name#','#comment#','#refKey#');";
	private $query_delete_project = "CALL sp_delete_project(#projectId#);";
	private $sp_update_project = "CALL sp_update_project('#projectId#','#name#','#comment#','#category#','#gridX#','#gridY#','#storage#');";
	private $sp_get_project_by_id = "CALL sp_get_project_by_id(#id#);";
	private $sp_get_project_by_ref = "CALL sp_get_project_by_ref('{ref}');";
	private $query_getFullProjectList = "CALL sp_get_project_all();";

	function __construct($dbConnector, $adapters, $personModule, $authModule)
	{
		parent::__construct($dbConnector, $adapters);

		$this->personModule = $personModule;
		$this->authModule = $authModule;
	}

	/**
	 *
	 */
	function getAllProjects()
	{
		$result = $this->databaseController->executeStoredProcedureToArray($this->query_getFullProjectList);

		if (count($result) > 0)
		{
			$project = $this->matchCarer($result);
		}
		else
		{
			return array();
		}

		return $project;
	}

	/**
	 * Saves or updates the Project
	 */
	function saveOrUpdateProject($project) {
		$succeeded = true;
		$query = "";

		try
		{
			if ($project->Id == null)
			{
				$query = $this->sp_create_project;

				$query = str_replace("#name#", $project->name, $query);
				$query = str_replace("#comment#", $project->comment, $query);
				$query = str_replace("#refKey#", $project->refKey, $query);
			}
			else
			{
				$query = $this->sp_update_project;

				$query = str_replace("#projectId#", $project->Id, $query);
				$query = str_replace("#name#", $project->name, $query);
				$query = str_replace("#comment#", $project->comment, $query);
				$query = str_replace("#category#", $project->category, $query);
				$query = str_replace("#gridX#", $project->gridX, $query);
				$query = str_replace("#gridY#", $project->gridY, $query);

				$query = str_replace("#storage#", $project->storage, $query);

			}

			$this->databaseController->executeInsertQuery($query);

		}
		catch (exception $ex)
		{
			$succeeded = false;
		}

		return $succeeded;
	}

	/**
	 * removes the Project by the specified Id
	 */
	function deleteProjectById($projectId) {

		$succeeded = true;

		try
		{
			$query = str_replace("#projectId#", $projectId, $this->query_delete_project);
			$this->databaseController->executeInsertQuery($query);
		}
		catch (exception $ex)
		{
			$succeeded = false;
		}

		return $succeeded;
	}

	/**
	 * Resolves the project by the specified id
	 */
	function getProjectById($id, $withAttributes = false) {

		$project = null;

		try
		{
			$query = str_replace("#id#", $id, $this -> sp_get_project_by_id);
			$result = $this -> databaseController -> executeStoredProcedureToArray($query);

			if (count($result) > 0)
			{
				$project = $this->buildProjectObjectFromDbRow($result[0], $withAttributes);
			}
		}
		catch(exception $ex)
		{
			$project = new Error();
		}

		return $project;
	}

	function getProjectByRef($ref)
	{
		$project = null;

		try
		{
			$query = str_replace("{ref}", $ref, $this->sp_get_project_by_ref);

			$result = $this->databaseController->executeStoredProcedureToArray($query);

			if (count($result) > 0)
			{
				$project = $this->buildProjectObjectFromDbRow($result[0], $withAttributes);
			}
		}
		catch(exception $ex)
		{
			$project = new Error();
		}

		return $project;
	}

	function matchCarer($project)
	{
		$allProjects = array();

		foreach ($project as $row)
		{
			$project = new Project();

			$project->Id = $row['projectId'];
			$project->name = $row['projectName'];
			$project->comment = $row['comment'];
			$project->category = $row['category'];
			$project->gridX = $row['gridX'];
			$project->gridY = $row['gridY'];
			$project->storage = $row['storage'];
			$project->refKey = $row['refKey'];

			array_push($allProjects, $project);
		}

		return $allProjects;
	}

	function buildProjectObjectFromDbRow($row, $withAttributes = false) {

		$project = new Project();

		$project->Id 		= $row['projectId'];
		$project->name 		= $row['projectName'];
		$project->comment 	= $row['comment'];
		$project->category 	= $row['category'];
		$project->gridX 	= $row['gridX'];
		$project->gridY 	= $row['gridY'];
		$project->storage 	= $row['storage'];
		$project->refKey 	= $row['refKey'];

		return $project;
	}
}
?>