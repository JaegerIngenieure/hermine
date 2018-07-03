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

class ProjectAdapter extends AbstractAdapterBase {

	// fields
	private $personModule;
	private $authModule;

	// sp names
	private $sp_create_project 			= "CALL sp_save_project('#name#','#comment#','#refKey#');";
	private $query_delete_project 		= "CALL sp_delete_project(#projectId#);";
	private $sp_update_project 			= "CALL sp_update_project('#projectId#','#name#','#comment#','#gridX#','#gridY#');";
	private $sp_get_project_by_id 		= "CALL sp_get_project_by_id(#id#);";
	private $sp_get_project_by_ref 		= "CALL sp_get_project_by_ref('{ref}');";
	private $query_getFullProjectList 	= "CALL sp_get_project_all();";
	private $query_get_Items_With_Empty_Fields = "CALL sp_get_items_with_empty_fields('{ref}');";
	private $query_get_Items_With_Used_Attribute = "CALL sp_get_items_with_used_attribute('{ref}','{name}','{attribute}');";

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
				$query = str_replace("#gridX#", $project->gridX, $query);
				$query = str_replace("#gridY#", $project->gridY, $query);
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
			$query = str_replace("#id#", $id, $this->sp_get_project_by_id);
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

	function getItemsWithEmptyFields($ref)
	{
		$query = str_replace("{ref}", $ref, $this->query_get_Items_With_Empty_Fields);
		
		$result = $this->databaseController->executeStoredProcedureToArray($query);

		if (count($result) > 0)
		{
			return $result;
		}
		else
		{
			return array();
		}		
	}

	function getItemsWithUsedAttribute($ref, $name, $attribute)
	{
		$query = str_replace("{ref}", $ref, $this->query_get_Items_With_Used_Attribute);
		$query = str_replace("{name}", $name, $query);
		$query = str_replace("{attribute}", $attribute, $query);
		
		$result = $this->databaseController->executeStoredProcedureToArray($query);

		if (count($result) > 0)
		{
			return $result;
		}
		else
		{
			return array();
		}		
	}

	function matchCarer($project)
	{
		$allProjects = array();

		foreach ($project as $row)
		{
			$project = new Project();

			$project->Id 		= $row['projectId'];
			$project->name 		= $row['projectName'];
			$project->comment 	= $row['comment'];
			$project->gridX 	= $row['gridX'];
			$project->gridY 	= $row['gridY'];
			$project->refKey 	= $row['refKey'];

			array_push($allProjects, $project);
		}

		return $allProjects;
	}

	function buildProjectObjectFromDbRow($row, $withAttributes = false) {

		$project = new Project();

		$project->Id 		= $row['projectId'];
		$project->name 		= $row['projectName'];
		$project->comment 	= $row['comment'];
		$project->gridX 	= $row['gridX'];
		$project->gridY 	= $row['gridY'];
		$project->refKey 	= $row['refKey'];

		return $project;
	}
}
?>