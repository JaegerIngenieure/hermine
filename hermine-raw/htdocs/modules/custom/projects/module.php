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

class ProjectsModule extends AbstractModuleBase {
    public $name	= "Projects";
    public $key		= "projects";

    // this is the equivalent ot the url path for the module
    public $description 		= "Management of projects";
    public $title 				= "Projects";
    public $permissions 		= array("100" => "Framework Administrator", "90" => "Administrator", "70" => "Moderator");
    public $hasAdminPanel 		= true;
    public $hasUserAdminPanel 	= true;
	public $showAtHome 			= true;
    public $adapters 			= array();
	
    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addModule($this->key, $this);
        $this->includeFiles(dirname(__FILE__));
		
		$dbController 	= $this->controller->getDatabaseController();
		//$authModule	= $this->controller->getModule('auth');
		
		$this->adapters['attributes'] = new AttributesAdapter($dbController, $this->adapters);
		$this->adapters['projects'] = new ProjectAdapter($dbController,$this->adapters, $this->controller->getModule('person'),$this -> controller -> getModule('auth'));
		$this->adapters['items'] = new ItemAdapter($dbController, $this->adapters, $this->controller->getModule('person'));
		
	}
		

 	/**
	 * Overridden function for providing access to the differen objects
	 */
	 function includeFiles($moduleRootFilePath) {
		$files = scandir($moduleRootFilePath."/model");

		include($moduleRootFilePath."/model/Project.model.php");
				
		$files = scandir($moduleRootFilePath."/adapter");

		// include adpater
		foreach($files as $file)
		{
			if ($file != "." && $file != "..")
			{
				include($moduleRootFilePath."/adapter/".$file);
			}
		}
	}

    function getJs() {

		return array(
            //routes
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/routes.js",

            //controllers
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/projects.controller.js",
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/projects-detail.controller.js",
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/projects-add-project.controller.js",
			$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/projects-storage-overview.controller.js",
			$this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/controllers/projects-searchUsedAttributes.controller.js",

            //directives
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/directives/project-detail.directive.js",

            //services
            $this->getContextController()->customModulesRootUrl . "/". $this->key ."/view/js/services/project.factory.js"
        );
    }

    function getCss() {

		return array($this -> getContextController()->customModulesRootUrl . "/". $this->key ."/view/css/style.css");
    }

    function getMenuItem() {
         $menu = "<li><a href=\"./\">Projects</a></li>";
        return $menu;
	}
	

	function getOverviewForProjects() {
		
		$authModule = $this->controller->getModule('auth');
		//include_once(dirname(__FILE__)."/../../model/error.php");

		if($authModule->isLoggedIn() && $authModule->getUserPermissionForModule($this->key) > 0)
		{
			include_once(dirname(__file__)."/view/uiElements/overview/index.php");
		}
		else
		{
			return new BrunchError($this -> key, 0, "No permissions", "getOverviewForProjects");
		}
	}
	
	/*-------------------------- Project API ----------------------------*/
	
	function getAllProjects($params)
	{
		$result = array();
		try
		{
			$result = $this->adapters['projects']->getAllProjects();
		}
		catch (Exception $ex)
		{
			$result = new BrunchError("Project","400","Could not load data","getAllProjects");
		}

		return $result;
	}

	function getProjectById($params)
	{
		$project = $this->adapters['projects']->getProjectById($params['projectId']);

		return $project;
	}

	function getProjectByRef($params) {
		
		$project = $this->adapters['projects']->getProjectByRef($params['projectRef']);

		return $project;
	}
	
	function getItemsWithEmptyFields($params) {
		
		$storage = $this->adapters['projects']->getItemsWithEmptyFields($params['projectId']);
		return $storage;
	}

	function getItemsWithUsedAttribute($params) {

		$ref 		= $params['ref'];
		$name 		= $params['name'];
		$attribute 	= $params['attribute'];		
		
		$values = $this->adapters['projects']->getItemsWithUsedAttribute($ref,$name,$attribute);
		return $values;
	}

	function getAllCategoriesForProject($params) {
		
		$categories = $this->adapters['attributes']->getAllCategoriesForProject($params['projectId']);
		return $categories;
	}

	function getAllStoragesForProject($params) {
		
		$storage = $this->adapters['attributes']->getAllStoragesForProject($params['projectId']);
		return $storage;
	}

	function getAllItemsById($params)
	{
		$projectId = $params['projectRef'];
		return $this->adapters['items']->getAllItemsById($projectId);
	}

    function getAllItemsForStorage($params) {

        $items = $this->adapters['items']->getAllItemsForStorage($params['storageName']);
        return $items;
    }

    function getAllStructureNodesForProject($params)
	{
		$nodes = $this->adapters['attributes']->getAllStructureNodesForProject($params['projectRef']);
		return $nodes;
	}

	function createNewProject($params) {

		$project = new Project();
		
		$project->name 		= $params['name'];
		$project->comment 	= $params['comment'];
		$project->refKey 	= $params['refKey'];

		$project = $this->adapters['projects']->saveOrUpdateProject($project);
										
		return true;
	}

	function updateProject($params) {
		$project = new Project();

		$project->Id 		= $params['Id'];
		$project->name 		= $params['name'];
		$project->comment 	= $params['comment'];
		$project->gridX 	= $params['gridX'];
		$project->gridY 	= $params['gridY'];
		
		$projectId = $this->adapters['projects']->saveOrUpdateProject($project);
		return true;
	}

	
	/**
	 * saves as new attribute or updates a existing one
	 */
	function saveOrUpdateAttribute($params) {
		
		$attributeId 		= $params['attributeId'];
		$attributeValue 	= $params['attributeValue'];
		$referenceId 		= $params['refId'];
		$attributeTypeId 	= $params['attributeTypeId'];
		$groupId 			= $params['groupId'];

		$result = 0;

		try
		{
			$result = $this->adapters['attributes']->saveOrUpdateAttribute($attributeId,$attributeTypeId,$attributeValue,$referenceId,$groupId);
		}
		catch (Exception $ex)
		{
			$result = new BrunchError($this->key,"10","Failed to store data","saveOrUpdateAttribute");
		}

		return $result;
	}

	function saveStorage($params) {
		
		$attributeValue 	= $params['attributeValue'];
		$referenceId 		= $params['refId'];
		$attributeTypeId 	= $params['attributeTypeId'];
		$groupId 			= $params['groupId'];

		$result = 0;

		try
		{
			$result = $this->adapters['attributes']->saveStorage($attributeTypeId,$attributeValue,$referenceId,$groupId);
		}
		catch (Exception $ex)
		{
			$result = new BrunchError($this->key,"10","Failed to save data","saveStorage");
		}

		return $result;
	}

	function deleteStorage($params) {
		
		// var_dump($ref);
		$refKey = $params['refKey'];

		try
		{
			$result = $this->adapters['attributes']->deleteStorage($refKey);
		}
		catch (Exception $ex)
		{
			$result = new BrunchError($this->key,"10","Failed to delete Storage data","deleteStorage");
		}

		return $result;
	}

	function saveOrUpdateStructureNode($params)
	{
		
		$attributeId 		= $params['attributeId'];
		$attributeValue 	= $params['attributeValue'];
		$attributeTypeId 	= $params['attributeTypeId'];
		$referenceId 		= $params['refId'];
		$groupId 			= $params['groupId'];

		$result = 0;

		try
		{
			$result = $this->adapters['attributes']->saveOrUpdateStructureNode($attributeId,$attributeTypeId,$attributeValue,$referenceId,$groupId);
		}
		catch (Exception $ex)
		{
			$result = new BrunchError($this->key,"10","Failed to store data","saveOrUpdateStructureNode");
		}

		return $result;
	}

	function removeStructureNode($params)
	{
		$attributeId 		= $params['attributeId'];
		$referenceId 		= $params['refId'];
		$groupId 			= $params['groupId'];

		$result = $this->adapters['attributes']->removeStructureNode($attributeId,$referenceId,$groupId);
		
		return $result;		
	}

	/**
	 * removes the attribute that is specified by the given id
	 */
	function removeAttributeById($params) {
		$attributeId = $params['attributeId'];
		$data = $this->adapters['attributes']->removeAttributeById($attributeId);

		return $data;
	}
		
	/**
	 * Removes the Project by the specified id
	 */
	function deleteProjectById($params) {
		
		try
		{
			$entries = $this->adapters['projects']->deleteProjectById($params['projectId']);
		}
		catch(Exception $ex)
		{
			
		}

		return $entries;
	}

	/**
     * Export whole project
     */
	function exportProject($params) {

	    //set vars
        $location       = str_replace("\\","/",dirname(__FILE__))."/../../../_exports/";

	    //export data from db
	    //get database controller
	    $dbController   = $this->controller->getDatabaseController();

	    //set tables
        $tables         = array("attributes","historyentries","items","projects");
        $cols           = array("attributeId","historyEntryId","ID","projectId");

	    //export tables
        $c = 0;
        foreach($tables as $table) {
            $query = "CREATE TABLE temptable LIKE ".$table.";";
            $dbController->executeQuery($query);
            $query = "INSERT INTO temptable SELECT * FROM ".$table.";";
            $dbController->executeQuery($query);
            $query = "ALTER TABLE temptable DROP PRIMARY KEY;";
            $dbController->executeQuery($query);
            $query = "UPDATE temptable SET ".$cols[$c]." = NULL;";
            $dbController->executeQuery($query);
            $query = "SELECT * 
                FROM temptable 
                INTO OUTFILE '".$location.$table.".csv' 
                CHARACTER SET utf8 
                FIELDS ENCLOSED BY '\"'
                TERMINATED BY ';'
                ESCAPED BY '\"'
                LINES TERMINATED BY '\r\n';";
            $dbController->executeQuery($query);
            $query = "DROP TABLE temptable;";
            $dbController->executeQuery($query);
            $c++;
            if(!file_exists($location.$table.".csv")) {
                return false;
            }
        }


        //zip uploaded files and database exports
        //create zip
        $zip    = new ZipArchive();
        $zFName = date("Y").date("m").date("d")."-hermine-export.zip";
        $zipName= $location.$zFName;
        if($zip->open($zipName, ZipArchive::CREATE) === TRUE) {

            //check if target is dir or file
            $source = realpath($location . "../modules/core/files/data");
            $rSrc   = realpath($location . "../modules/core/files");
            if(is_dir($source) === true) {

                //if is dir create iterator
                $files  = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::LEAVES_ONLY);

                //iterate dir
                foreach($files as $file) {
                    $file   = realpath($file);
                    if(is_dir($file) === true) {
                        $dirName    = substr(str_replace($rSrc, '', $file),1);
                        if($dirName != "" && $dirName != "/" && $dirName != "_exports") {
                            $zip->addEmptyDir($dirName);
                        }
                    } else if (is_file($file) === true) {
                        $fileName   = substr(str_replace($rSrc, '', $file),1);
                        $zip->addFromString($fileName, file_get_contents($file));
                    }
                }
            } else if(is_file($source) === true) {
                $zip->addFromString(basename($source), file_get_contents($source));
            }

            //manually add db exports
            foreach($tables as $table) {
                $source = $location.$table.".csv";
                $zip->addFromString(basename($source), file_get_contents($source));
            }

            //check if zip creation worked
            if (!$zip->close()) {
                return false;
            }
        }


        //export cleanup  process
        foreach($tables as $table) {
            unlink($location.$table.".csv");
            if(file_exists($location.$table.".csv")) {
                return false;
            }
        }

        //return zip name
        return array("url" => "/_exports/".$zFName);
    }

    /**
     * import file
     */
    function doImport() {

        //set vars
        $location       = str_replace("\\","/",dirname(__FILE__))."/../../core/files/";

        //try to unzip file
        $zip    = new ZipArchive();
        $data   = $zip->open($_FILES["file"]["tmp_name"]);
        if($data === true) {
            $zip->extractTo($location);
            $zip->close();
        } else {
            echo "Archive could not be extracted.";
            return false;
        }

        //check if all dumps exist
        $tables         = array("attributes","historyentries","items","projects");
        foreach($tables as $table) {
            if(!file_exists($location.$table.".csv")) {
                echo "Expected dumps not existing.";
                return false;
            }
        }

        //get database controller
        $dbController   = $this->controller->getDatabaseController();

        //check if all project refs are unique
        $row = 1;
        if (($handle = fopen($location."projects.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                $num = count($data);
                if(count($this->getProjectByRef(array("projectRef" => $data[$num-1]))) > 0) {
                    echo "Exactly same project already exists.";
                    return false;
                }
            }
            fclose($handle);
        }

        //import all dumps and delete afterwards
        foreach($tables as $table) {
            $query = "
                LOAD DATA INFILE '".$location.$table.".csv'
                INTO TABLE ".$table." 
                CHARACTER SET utf8 
                FIELDS ENCLOSED BY '\"'
                TERMINATED BY ';'
                ESCAPED BY '\"'
                LINES TERMINATED BY '\r\n';";
            $dbController->executeQuery($query);
            unlink($location.$table.".csv");
        }

        return array("status" => true);
    }
	
}
?>